const yearTarget = document.querySelector('#year');
const revealNodes = document.querySelectorAll('.reveal');
const kidsLibrary = document.querySelector('#kids-library');

const kidsAudioLibrary = [
    {
        ageGroup: '2-3 Jahre',
        groups: [
            {
                title: 'Hoerspiele',
                items: [
                    { title: 'Lars besucht O-o-o-oma', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 2-3-j\u00e4hrige Kinder/Lars besucht O-o-o-oma.wav' },
                    { title: 'Lars geht schla-schla-schla-schlafen', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 2-3-j\u00e4hrige Kinder/Lars geht schla-schla-schla-schlafen.wav' },
                    { title: 'Lars hilft beim Ei-ei-ei-einkaufen', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 2-3-j\u00e4hrige Kinder/Lars hilft beim Ei-ei-ei-einkaufen.wav' },
                    { title: 'La-la-la-lars und der Regentag', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 2-3-j\u00e4hrige Kinder/La-la-la-lars und der Regentag.wav' },
                    { title: 'Ein Tag auf dem Spie-spi-spi-spielplatz', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 2-3-j\u00e4hrige Kinder/Ein Tag auf dem Spie-spi-spi-spielplatz.wav' }
                ]
            }
        ]
    },
    {
        ageGroup: '4-6 Jahre',
        groups: [
            {
                title: 'Techniken',
                items: [
                    { title: 'Kapitel 1 - Flora', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 1 - Flora.wav' },
                    { title: 'Kapitel 2 - Die Braunbaerin', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 2 - Die Braunb\u00e4rin.wav' },
                    { title: 'Kapitel 3 - Die Schwalbe', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 3 - Die Schwalbe.wav' },
                    { title: 'Kapitel 4 - Die Luchsin', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 4 - Die Luchsin.wav' },
                    { title: 'Kapitel 5 - Die Papageien-Dame', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 5 - Die Papageien-Dame.wav' },
                    { title: 'Kapitel 6 - Das Reh', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 6 - Das Reh.wav' },
                    { title: 'Kapitel 7 - Die Haesin', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 7 - Die H\u00e4sin.wav' },
                    { title: 'Kapitel 8 - Zuhause', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Techniken/Kapitel 8 - Zuhause.wav' }
                ]
            },
            {
                title: 'Pseudostottern',
                items: [
                    { title: 'Kapitel 1 - Flora', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 1 - Flora.wav' },
                    { title: 'Kapitel 2 - Die Braunbaerin', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 2 - Die Braunb\u00e4rin.wav' },
                    { title: 'Kapitel 3 - Die Schwalbe', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 3 - Die Schwalbe.wav' },
                    { title: 'Kapitel 4 - Die Luchsin', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 4 - Die Luchsin.wav' },
                    { title: 'Kapitel 5 - Die Papageien-Dame', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 5 - Die Papageien-Dame.wav' },
                    { title: 'Kapitel 6 - Das Reh', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 6 - Das Reh.wav' },
                    { title: 'Kapitel 7 - Die Haesin', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 7 - Die H\u00e4sin.wav' },
                    { title: 'Kapitel 8 - Zuhause', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 4-6-j\u00e4hrige Kinder/Pseudostottern/Kapitel 8 - Zuhause.wav' }
                ]
            }
        ]
    },
    {
        ageGroup: '7-11 Jahre',
        groups: [
            {
                title: 'Techniken',
                items: [
                    { title: 'Die Uhr', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Techniken/Die Uhr .wav' },
                    { title: 'Das verlassene Boot', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Techniken/Das verlassene Boot.wav' },
                    { title: 'Die geheime Tuer', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Techniken/Die geheime T\u00fcr.wav' },
                    { title: 'Der Zauberstift', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Techniken/Der Zauberstift.wav' }
                ]
            },
            {
                title: 'Pseudostottern',
                items: [
                    { title: 'Die Uhr', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Pseudostottern/Die Uhr .wav' },
                    { title: 'Die geheime Tuer', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Pseudostottern/Die geheime T\u00fcr.wav' },
                    { title: 'Der Zauberstift', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Pseudostottern/Der Zauberstift.wav' },
                    { title: 'Das verlassene Boot am See', path: 'H\u00f6rspiele f\u00fcr stotternde Kinder/H\u00f6rspiele f\u00fcr 7-11-j\u00e4hrige Kinder/Pseudostottern/Das verlassene Boot am See.wav' }
                ]
            }
        ]
    }
];

function renderKidsLibrary() {
    if (!kidsLibrary) {
        return;
    }

    const markup = kidsAudioLibrary
        .map((ageGroup) => {
            const trackCount = ageGroup.groups.reduce((count, group) => count + group.items.length, 0);

            const groupsMarkup = ageGroup.groups
                .map((group) => {
                    const itemsMarkup = group.items
                        .map((item) => {
                            const sourcePath = encodeURI(item.path);

                            return `
                                <article class="kids-track-card">
                                    <h5 class="kids-track-title">${item.title}</h5>
                                    <p class="kids-track-meta">${group.title}</p>
                                    <audio class="kids-audio" controls preload="none">
                                        <source src="${sourcePath}" type="audio/wav">
                                        Dein Browser kann diese Audiodatei nicht direkt abspielen.
                                    </audio>
                                    <div class="kids-track-actions">
                                        <a class="kids-link kids-link-primary" href="${sourcePath}" download>Herunterladen</a>
                                        <a class="kids-link kids-link-secondary" href="${sourcePath}" target="_blank" rel="noreferrer">Direkt oeffnen</a>
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
                            <div class="kids-track-grid">
                                ${itemsMarkup}
                            </div>
                        </div>
                    `;
                })
                .join('');

            return `
                <section class="kids-age-card">
                    <div class="kids-age-head">
                        <h3>${ageGroup.ageGroup}</h3>
                        <div class="kids-age-count">${trackCount} Hoerspiele</div>
                    </div>
                    ${groupsMarkup}
                </section>
            `;
        })
        .join('');

    kidsLibrary.innerHTML = markup;
}

if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
}

renderKidsLibrary();

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.18 }
);

revealNodes.forEach((node) => observer.observe(node));