const kidsLibrary = document.querySelector('.kids-library');
const kidsTabs = Array.from(document.querySelectorAll('.kids-tab'));
const kidsPanels = kidsTabs.map((tab) => document.getElementById(`age-${tab.dataset.age}`));

const player = document.querySelector('#kids-player');
const audio = player.querySelector('audio');
const playerCover = player.querySelector('.kids-player-cover');
const playerTitle = player.querySelector('[data-player-title]');
const playerSub = player.querySelector('[data-player-sub]');
const playerToggle = player.querySelector('[data-action="toggle"]');
const playerSeek = player.querySelector('.kids-player-seek');
const timeCurrent = player.querySelector('[data-time-current]');
const timeTotal = player.querySelector('[data-time-total]');

const SKIP_SECONDS = 15;

let current = null;
let isSeeking = false;

function formatTime(seconds) {
    const total = Math.max(0, Math.floor(seconds || 0));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function formatMinutes(seconds) {
    return `${Math.max(1, Math.round(seconds / 60))} Min.`;
}

function formatMegabytes(value) {
    return `${Number(value).toFixed(1).replace('.', ',')} MB`;
}

/* ---------- Altersgruppen-Tabs ---------- */

function selectAge(age, { focusTab = false } = {}) {
    const index = kidsTabs.findIndex((tab) => tab.dataset.age === age);

    if (index === -1) {
        return;
    }

    kidsTabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.tabIndex = isActive ? 0 : -1;
        kidsPanels[tabIndex].hidden = !isActive;
    });

    kidsLibrary.dataset.active = age;

    if (focusTab) {
        kidsTabs[index].focus();
    }
}

function ageFromHash() {
    const match = window.location.hash.match(/^#age-(.+)$/);
    return match ? match[1] : null;
}

function setupTabs() {
    const tablist = document.querySelector('.kids-tabs');

    if (!tablist || !kidsTabs.length) {
        return;
    }

    kidsLibrary.classList.add('has-tabs');
    tablist.setAttribute('role', 'tablist');

    kidsTabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', kidsPanels[index].id);
        kidsPanels[index].setAttribute('role', 'tabpanel');
        kidsPanels[index].setAttribute('aria-labelledby', tab.id);

        tab.addEventListener('click', (event) => {
            event.preventDefault();
            selectAge(tab.dataset.age);
            history.replaceState(null, '', `#age-${tab.dataset.age}`);
        });

        tab.addEventListener('keydown', (event) => {
            const offsets = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

            if (!(event.key in offsets)) {
                return;
            }

            event.preventDefault();
            const nextIndex = (index + offsets[event.key] + kidsTabs.length) % kidsTabs.length;
            selectAge(kidsTabs[nextIndex].dataset.age, { focusTab: true });
        });
    });

    const initialAge = ageFromHash();
    selectAge(initialAge || kidsTabs[0].dataset.age);

    if (initialAge) {
        requestAnimationFrame(() => tablist.scrollIntoView({ block: 'start' }));
    }

    window.addEventListener('hashchange', () => {
        const age = ageFromHash();

        if (age) {
            selectAge(age);
            tablist.scrollIntoView({ block: 'start' });
        }
    });
}

/* ---------- Geschichten & Versionen ---------- */

function getActiveVersion(story) {
    return story.querySelector('[data-version][aria-pressed="true"]') || story;
}

function getChapters(story) {
    const version = getActiveVersion(story);
    return JSON.parse(version.dataset.chapters || '[]');
}

function getChapterNames(story) {
    return Array.from(story.querySelectorAll('.kids-chapter-name')).map((node) => node.textContent);
}

function getCurrentChapterIndex(chapters, time) {
    let index = 0;

    chapters.forEach((start, chapterIndex) => {
        if (time >= start) {
            index = chapterIndex;
        }
    });

    return index;
}

function updateStoryDetails(story) {
    const version = getActiveVersion(story);
    const chapters = getChapters(story);
    const download = story.querySelector('.kids-download');
    const metaNode = story.querySelector('[data-meta]');
    const title = story.dataset.title;

    if (version.dataset.dur && metaNode) {
        const chapterText = chapters.length ? `${chapters.length} Kapitel · ` : '';
        metaNode.textContent = `${chapterText}${formatMinutes(Number(version.dataset.dur))}`;
    }

    if (download) {
        const size = formatMegabytes(version.dataset.mb);
        download.href = version.dataset.src;
        download.querySelector('[data-size]').textContent = size;
        download.setAttribute('aria-label', `„${title}“ (${version.dataset.version}) herunterladen (${size})`);
    }

    story.querySelectorAll('.kids-chapter').forEach((button, index) => {
        const timeNode = button.querySelector('.kids-chapter-time');

        if (timeNode && chapters[index] !== undefined) {
            timeNode.textContent = formatTime(chapters[index]);
        }
    });
}

function setupVersions() {
    document.querySelectorAll('.kids-version').forEach((group) => {
        const story = group.closest('.kids-story');

        group.querySelectorAll('[data-version]').forEach((button) => {
            button.addEventListener('click', () => {
                if (button.getAttribute('aria-pressed') === 'true') {
                    return;
                }

                const wasPlaying = current && current.story === story && !audio.paused;
                const chapterIndex = current && current.story === story
                    ? getCurrentChapterIndex(current.chapters, audio.currentTime)
                    : 0;

                group.querySelectorAll('[data-version]').forEach((other) => {
                    other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
                });

                updateStoryDetails(story);

                if (current && current.story === story) {
                    const chapters = getChapters(story);
                    loadStory(story, chapters[chapterIndex] || 0);

                    if (wasPlaying) {
                        playAudio();
                    }
                }
            });
        });
    });
}

/* ---------- Player ---------- */

function playAudio() {
    const attempt = audio.play();

    if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {});
    }
}

function seekTo(seconds) {
    const apply = () => {
        audio.currentTime = seconds;
    };

    if (audio.readyState >= 1) {
        apply();
    } else {
        audio.addEventListener('loadedmetadata', apply, { once: true });
    }
}

function loadStory(story, startAt = 0) {
    const version = getActiveVersion(story);
    const src = version.dataset.src;

    if (current && current.story !== story) {
        current.story.classList.remove('is-current', 'is-playing');
        updatePlayButton(current.story, false);
    }

    current = {
        story,
        chapters: getChapters(story),
        chapterNames: getChapterNames(story),
        versionName: version.dataset.version || ''
    };

    if (audio.getAttribute('src') !== src) {
        audio.src = src;
        timeTotal.textContent = formatTime(Number(version.dataset.dur || 0));
        playerSeek.max = String(Number(version.dataset.dur || 100));
        setProgress(startAt);
    }

    seekTo(startAt);

    story.classList.add('is-current');
    playerCover.src = story.dataset.cover;
    playerTitle.textContent = story.dataset.title;
    updateSubtitle();

    player.hidden = false;
    document.body.classList.add('has-player');
    updateMediaSession();
}

function updateSubtitle() {
    if (!current) {
        return;
    }

    const parts = [current.story.dataset.ageLabel];

    if (current.versionName) {
        parts.push(current.versionName);
    }

    if (current.chapters.length) {
        const index = getCurrentChapterIndex(current.chapters, audio.currentTime);
        parts.push(`Kapitel ${index + 1}: ${current.chapterNames[index] || ''}`);

        current.story.querySelectorAll('.kids-chapter').forEach((button, buttonIndex) => {
            if (buttonIndex === index) {
                button.setAttribute('aria-current', 'true');
            } else {
                button.removeAttribute('aria-current');
            }
        });
    }

    const text = parts.join(' · ');

    if (playerSub.textContent !== text) {
        playerSub.textContent = text;
    }
}

function updatePlayButton(story, isPlaying) {
    const button = story.querySelector('.kids-play');
    const title = story.dataset.title;

    story.classList.toggle('is-playing', isPlaying);
    button.setAttribute('aria-label', `„${title}“ ${isPlaying ? 'pausieren' : 'abspielen'}`);
}

function updatePlayingState() {
    const isPlaying = !audio.paused && !audio.ended;

    player.classList.toggle('is-playing', isPlaying);
    playerToggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Abspielen');

    if (current) {
        updatePlayButton(current.story, isPlaying);
    }

    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
}

function setProgress(time) {
    const duration = Number(playerSeek.max) || 1;
    const value = Math.min(time, duration);

    playerSeek.value = String(value);
    playerSeek.style.setProperty('--progress', `${(value / duration) * 100}%`);
    timeCurrent.textContent = formatTime(value);
}

function skip(seconds) {
    if (!current) {
        return;
    }

    const duration = audio.duration || Number(playerSeek.max) || 0;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), duration);
}

function closePlayer() {
    audio.pause();
    player.hidden = true;
    document.body.classList.remove('has-player');

    if (current) {
        current.story.classList.remove('is-current');
        updatePlayButton(current.story, false);
    }
}

function updateMediaSession() {
    if (!('mediaSession' in navigator) || !current || typeof MediaMetadata === 'undefined') {
        return;
    }

    const artworkUrl = new URL('assets/images/apple-touch-icon.png', window.location.href).href;

    navigator.mediaSession.metadata = new MediaMetadata({
        title: current.story.dataset.title,
        artist: 'IMS Go Hörspiele',
        album: [current.story.dataset.ageLabel, current.versionName].filter(Boolean).join(' · '),
        artwork: [{ src: artworkUrl, sizes: '180x180', type: 'image/png' }]
    });
}

function setupMediaSessionHandlers() {
    if (!('mediaSession' in navigator)) {
        return;
    }

    const handlers = {
        play: () => playAudio(),
        pause: () => audio.pause(),
        seekbackward: () => skip(-SKIP_SECONDS),
        seekforward: () => skip(SKIP_SECONDS),
        seekto: (details) => {
            if (typeof details.seekTime === 'number') {
                audio.currentTime = details.seekTime;
            }
        }
    };

    Object.entries(handlers).forEach(([action, handler]) => {
        try {
            navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
            // Aktion wird von diesem Browser nicht unterstützt.
        }
    });
}

function setupPlayer() {
    document.querySelectorAll('.kids-story').forEach((story) => {
        story.querySelector('.kids-play').addEventListener('click', () => {
            const version = getActiveVersion(story);
            const isLoaded = current && current.story === story && audio.getAttribute('src') === version.dataset.src;

            if (isLoaded) {
                if (audio.paused) {
                    playAudio();
                } else {
                    audio.pause();
                }
                return;
            }

            loadStory(story, 0);
            playAudio();
        });

        story.querySelectorAll('.kids-chapter').forEach((button) => {
            button.addEventListener('click', () => {
                const chapters = getChapters(story);
                const start = chapters[Number(button.dataset.chapter)] || 0;

                if (current && current.story === story && audio.getAttribute('src') === getActiveVersion(story).dataset.src) {
                    audio.currentTime = start;
                } else {
                    loadStory(story, start);
                }

                playAudio();
            });
        });
    });

    player.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');

        if (!button) {
            return;
        }

        const action = button.dataset.action;

        if (action === 'toggle') {
            if (audio.paused) {
                playAudio();
            } else {
                audio.pause();
            }
        } else if (action === 'back') {
            skip(-SKIP_SECONDS);
        } else if (action === 'forward') {
            skip(SKIP_SECONDS);
        } else if (action === 'close') {
            closePlayer();
        }
    });

    playerSeek.addEventListener('input', () => {
        isSeeking = true;
        setProgress(Number(playerSeek.value));
    });

    playerSeek.addEventListener('change', () => {
        audio.currentTime = Number(playerSeek.value);
        isSeeking = false;
    });

    audio.addEventListener('play', updatePlayingState);
    audio.addEventListener('pause', updatePlayingState);
    audio.addEventListener('ended', () => {
        updatePlayingState();
        setProgress(0);
    });

    audio.addEventListener('durationchange', () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            playerSeek.max = String(Math.floor(audio.duration));
            timeTotal.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (!isSeeking) {
            setProgress(audio.currentTime);
        }

        updateSubtitle();
    });

    setupMediaSessionHandlers();
}

setupTabs();
setupVersions();
setupPlayer();
