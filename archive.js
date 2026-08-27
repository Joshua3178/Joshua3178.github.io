const grid = document.querySelector('#archive-grid');
const search = document.querySelector('#search');
const summary = document.querySelector('#archive-summary');

function draw(items) {
  summary.textContent = 'Each entry has a release status. Source material is published only after privacy, ownership and licence review.';
  grid.innerHTML = items.map(item => `
    <article class="archive-item">
      <p class="area">${item.Category}</p>
      <h2>${item.Candidate}</h2>
      <p>${item.SignalFiles} project-signal files · ${item.FileTypes || 'mixed project files'}</p>
      <span>${item.PublicationStatus}</span>
    </article>
  `).join('');
}

search.addEventListener('input', () => {
  const term = search.value.trim().toLowerCase();
  draw(archiveItems.filter(item => `${item.Category} ${item.Candidate} ${item.FileTypes}`.toLowerCase().includes(term)));
});

draw(archiveItems);
