const yearTarget = document.querySelector('#year');
const kidsPageLibrary = document.querySelector('#kids-page-library');
const kidsAudioLibrary = window.kidsAudioLibrary || [];
const kidsTopbar = document.querySelector('.kids-page-topbar');
const kidsMenuToggle = document.querySelector('.menu-toggle');

const chapterPattern = /^Kapitel\s*(\d+)\s*-\s*(.+)$/i;

function createTrackDescription(itemTitle, groupTitle, ageGroup) {
    if (groupTitle === 'Pseudostottern') {
        return `Eine Hörgeschichte für ${ageGroup}, in der spielerisches Pseudostottern behutsam erlebbar wird.`;
    }

    return `Eine Hörgeschichte für ${ageGroup}, die Techniken in einer ruhigen und kindgerechten Form verankert.`;
}

function createMergedItems(items) {
    const chapterItems = items
        .map((item) => {
            const match = item.title.match(chapterPattern);

            if (!match) {
                return null;
            }

            return {
                chapterNumber: Number(match[1]),
                chapterTitle: match[2],
                path: item.path
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.chapterNumber - b.chapterNumber);

    if (chapterItems.length >= 2 && chapterItems.length === items.length) {
        return [
            {
                title: 'Komplette Geschichte',
                paths: chapterItems.map((chapter) => chapter.path),
                chapterTitles: chapterItems.map((chapter) => `Kapitel ${chapter.chapterNumber} - ${chapter.chapterTitle}`),
                isMergedStory: true
            }
        ];
    }

    return items.map((item) => ({
        title: item.title,
        paths: [item.path],
        chapterTitles: [item.title],
        isMergedStory: false
    }));
}

function getAudioMimeType(path) {
    if (path.toLowerCase().endsWith('.m4a')) {
        return 'audio/mp4';
    }

    return 'audio/wav';
}

function renderChapterDownloads(item) {
    if (!item.isMergedStory) {
        const sourcePath = encodeURI(item.paths[0]);
        return `<a class="kids-link kids-link-primary" href="${sourcePath}" download>Herunterladen</a>`;
    }

    const chapterLinks = item.paths
        .map((path, index) => {
            const sourcePath = encodeURI(path);
            const chapterTitle = item.chapterTitles[index];
            return `<a class="kids-link kids-link-secondary" href="${sourcePath}" download>${chapterTitle}</a>`;
        })
        .join('');

    return `
        <div class="kids-chapter-links" aria-label="Kapitel-Downloads">
            ${chapterLinks}
        </div>
    `;
}

function setupSequentialPlayback() {
    document.querySelectorAll('[data-playlist]').forEach((audioElement) => {
        const playlist = JSON.parse(audioElement.dataset.playlist || '[]');

        if (!playlist.length) {
            return;
        }

        let currentIndex = 0;

        audioElement.addEventListener('ended', () => {
            currentIndex += 1;

            const sourceElement = audioElement.querySelector('source');

            if (!sourceElement) {
                return;
            }

            if (currentIndex >= playlist.length) {
                currentIndex = 0;
                sourceElement.src = encodeURI(playlist[currentIndex]);
                audioElement.load();
                return;
            }

            sourceElement.src = encodeURI(playlist[currentIndex]);
            audioElement.load();
            audioElement.play();
        });
    });
}

function renderKidsPageLibrary() {
    if (!kidsPageLibrary) {
        return;
    }

    const markup = kidsAudioLibrary
        .map((ageGroup, index) => {
            const mergedGroups = ageGroup.groups.map((group) => ({
                ...group,
                mergedItems: createMergedItems(group.items)
            }));

            const trackCount = mergedGroups.reduce((count, group) => count + group.mergedItems.length, 0);
            const groupLabels = ageGroup.groups
                .map((group) => `<span class="kids-age-chip">${group.title}</span>`)
                .join('');

            const groupsMarkup = mergedGroups
                .map((group) => {
                    const itemsMarkup = group.mergedItems
                        .map((item) => {
                            const firstSourcePath = encodeURI(item.paths[0]);
                            const sourceMimeType = getAudioMimeType(item.paths[0]);
                            const coverImagePath = encodeURI(ageGroup.coverImage);
                            const chapterInfo = item.isMergedStory ? `<p class="kids-track-description">Alle ${item.paths.length} Kapitel werden automatisch nacheinander abgespielt.</p>` : '';
                            const playlistData = item.paths.map((path) => path.replace(/"/g, '&quot;'));

                            return `
                                <article class="kids-track-card reveal">
                                    <div class="kids-track-cover kids-track-cover-${ageGroup.ageKey}">
                                        <img class="kids-track-cover-art" src="${coverImagePath}" alt="Cover für ${ageGroup.ageGroup}">
                                    </div>
                                    <div class="kids-track-body">
                                        <h3 class="kids-track-title">${item.title}</h3>
                                        ${chapterInfo}
                                        <div class="kids-track-controls">
                                            <audio class="kids-audio" controls preload="none" data-playlist='${JSON.stringify(playlistData)}'>
                                                <source src="${firstSourcePath}" type="${sourceMimeType}">
                                            </audio>
                                        </div>
                                        ${renderChapterDownloads(item)}
                                    </div>
                                </article>
                            `;
                        })
                        .join('');

                    return `
                        <div class="kids-type-group">
                            <div class="kids-type-header">
                                <span class="kids-type-badge">${group.title}</span>
                                <h4>${group.items.length} Titel</h4>
                            </div>
                            <p class="kids-track-description">${group.title === 'Pseudostottern' ? 'Material zum vorsichtigen Ausprobieren und Wahrnehmen von Sprechmomenten.' : 'Geschichten zum Einbetten und Wiedererkennen von Techniken im Alltag.'}</p>
                            <div class="kids-track-grid">
                                ${itemsMarkup}
                            </div>
                        </div>
                    `;
                })
                .join('');

            return `
                <section class="kids-age-card kids-age-card-${ageGroup.ageKey}" id="age-${ageGroup.ageKey}">
                    <details class="kids-age-disclosure">
                        <summary class="kids-age-summary">
                            <div class="kids-age-summary-main">
                                <div>
                                    <h2>${ageGroup.ageGroup}</h2>
                                    <p class="kids-track-description">${ageGroup.description}</p>
                                </div>
                                <div class="kids-age-chip-row">
                                    ${groupLabels}
                                </div>
                            </div>
                            <div class="kids-age-summary-side">
                                <div class="kids-age-count">${trackCount} Hörspiele</div>
                                <span class="kids-age-toggle" aria-hidden="true"></span>
                            </div>
                        </summary>
                        <div class="kids-age-panel">
                            ${groupsMarkup}
                        </div>
                    </details>
                </section>
            `;
        })
        .join('');

    kidsPageLibrary.innerHTML = markup;
    setupSequentialPlayback();
}

function openAgeGroupFromHash() {
    const hash = window.location.hash;

    if (!hash || !hash.startsWith('#age-')) {
        return;
    }

    const ageCard = document.querySelector(hash);

    if (!ageCard) {
        return;
    }

    const disclosure = ageCard.querySelector('.kids-age-disclosure');

    if (disclosure) {
        disclosure.open = true;
    }
}

if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
}

renderKidsPageLibrary();
openAgeGroupFromHash();

window.addEventListener('hashchange', openAgeGroupFromHash);

document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));

if (kidsTopbar && kidsMenuToggle) {
    const closeMenu = () => {
        kidsTopbar.classList.remove('menu-open');
        kidsMenuToggle.setAttribute('aria-expanded', 'false');
    };

    kidsMenuToggle.addEventListener('click', () => {
        const shouldOpen = !kidsTopbar.classList.contains('menu-open');

        kidsTopbar.classList.toggle('menu-open', shouldOpen);
        kidsMenuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    });

    kidsTopbar.querySelectorAll('.kids-page-nav a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!kidsTopbar.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}