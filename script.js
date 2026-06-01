const yearTarget = document.querySelector('#year');
const revealNodes = document.querySelectorAll('.reveal');

if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
}

revealNodes.forEach((node) => node.classList.add('is-visible'));