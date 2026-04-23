const yearTarget = document.querySelector('#year');
const kidsPageLibrary = document.querySelector('#kids-page-library');
const kidsAudioLibrary = window.kidsAudioLibrary || [];

function createTrackDescription(itemTitle, groupTitle, ageGroup) {
    if (groupTitle === 'Pseudostottern') {
        return `Eine Hörgeschichte für ${ageGroup}, in der spielerisches Pseudostottern behutsam erlebbar wird.`;
    }

    return `Eine Hörgeschichte für ${ageGroup}, die Techniken in einer ruhigen und kindgerechten Form verankert.`;
}

function renderKidsPageLibrary() {
    if (!kidsPageLibrary) {
        return;
    }

    const markup = kidsAudioLibrary
        .map((ageGroup, index) => {
            const trackCount = ageGroup.groups.reduce((count, group) => count + group.items.length, 0);
            const groupLabels = ageGroup.groups
                .map((group) => `<span class="kids-age-chip">${group.title}</span>`)
                .join('');

            const groupsMarkup = ageGroup.groups
                .map((group) => {
                    const itemsMarkup = group.items
                        .map((item) => {
                            const sourcePath = encodeURI(item.path);
                            const coverImagePath = encodeURI(ageGroup.coverImage);

                            return `
                                <article class="kids-track-card reveal">
                                    <div class="kids-track-cover kids-track-cover-${ageGroup.ageKey}">
                                        <img class="kids-track-cover-art" src="${coverImagePath}" alt="Cover für ${ageGroup.ageGroup}">
                                    </div>
                                    <div class="kids-track-body">
                                        <h3 class="kids-track-title">${item.title}</h3>
                                        <div class="kids-track-controls">
                                            <audio class="kids-audio" controls preload="none">
                                                <source src="${sourcePath}" type="audio/wav">
                                            </audio>
                                            <a class="kids-link kids-link-primary" href="${sourcePath}" download>Herunterladen</a>
                                        </div>
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

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));