import { positionCount, filterRoles, searchUrl, escaped, categories, cityChoices } from './logic.js';

const grid = document.getElementById('job-grid');
const chips = document.getElementById('category-filters');
const summary = document.getElementById('summary-buttons');
const location = document.getElementById('location');
const search = document.getElementById('search');
const count = document.getElementById('results-count');
const empty = document.getElementById('empty-state');
const clear = document.getElementById('clear-btn');
const params = new URLSearchParams(locationInPage());
const state = { query: params.get('q') || '', category: params.get('category') || '', city: params.get('city') || '' };
let jobs = [];

function locationInPage() { return window.location.search; }

const pin = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>`;

function renderCard(job) {
  const precise = job.source === 'official-posting';
  const href = precise ? job.url : searchUrl(job.title);
  const label = precise ? 'View official role' : 'Search official site';
  const note = precise ? (job.positions > 1 ? 'One linked posting' : 'Direct Workday link') : 'Find latest matching role';
  const tag = job.positions > 1 ? `<span class="position-pill">${job.positions} positions shown</span>` : '';
  return `<article class="job-card">
    <div class="card-top"><span class="category-pill">${escaped(job.category)}</span>${tag}</div>
    <h3>${escaped(job.title)}</h3>
    <p class="job-location">${pin}<span>${escaped(job.location)}</span></p>
    <div class="skill-list">${job.keywords.slice(0,3).map(skill => `<span class="skill">${escaped(skill)}</span>`).join('')}</div>
    <div class="card-action-row"><span class="action-label">${note}</span><a class="job-link" href="${escaped(href)}" target="_blank" rel="noopener noreferrer" aria-label="${label} for ${escaped(job.title)} on Genesys Workday">${label}<span aria-hidden="true">↗</span></a></div>
  </article>`;
}

function render() {
  const shown = filterRoles(jobs, state);
  const matches = positionCount(shown);
  const active = Boolean(state.query || state.category || state.city);
  grid.innerHTML = shown.map(renderCard).join('');
  empty.hidden = shown.length !== 0;
  grid.hidden = shown.length === 0;
  clear.hidden = !active;
  count.innerHTML = `Showing <strong>${shown.length}</strong> role ${shown.length===1?'title':'titles'} · <strong>${matches}</strong> ${matches===1?'position':'positions'}${active ? ' matching your filters' : ' from the session'}`;
  for (const button of chips.querySelectorAll('button[data-category]')) button.setAttribute('aria-pressed', String(button.dataset.category === state.category));
  for (const button of summary.querySelectorAll('button[data-category]')) button.setAttribute('aria-pressed', String(button.dataset.category === state.category));
  const url = new URL(window.location.href);
  for (const [key, value] of [['q',state.query],['category',state.category],['city',state.city]]) value ? url.searchParams.set(key,value) : url.searchParams.delete(key);
  window.history.replaceState(null,'',url.pathname+url.search+url.hash);
}

function changeCategory(value, jump = false) {
  state.category = value; render();
  if (jump) document.getElementById('jobs').scrollIntoView({behavior:'smooth',block:'start'});
}
function reset() { state.query = ''; state.category = ''; state.city = ''; search.value = ''; location.value = ''; render(); search.focus(); }

function setup() {
  search.value = state.query;
  const categoryCounts = categories.map(cat => ({cat, count:positionCount(jobs.filter(j=>j.category===cat))}));
  summary.innerHTML = categoryCounts.map(({cat,count}) => `<button type="button" class="summary-button" data-category="${escaped(cat)}" aria-pressed="false"><strong>${count.toString().padStart(2,'0')}</strong><span>${escaped(cat)}</span></button>`).join('');
  chips.innerHTML = [{cat:'',count:positionCount(jobs)},...categoryCounts].map(({cat,count}) => `<button type="button" class="chip" data-category="${escaped(cat)}" aria-pressed="false">${escaped(cat || 'All roles')}<span class="chip-count">${count}</span></button>`).join('');
  const choices = cityChoices(jobs);
  for (const city of choices) { const option = document.createElement('option'); option.value=city; option.textContent=city; location.append(option); }
  if (!choices.includes(state.city)) state.city = '';
  if (!categories.includes(state.category)) state.category = '';
  location.value = state.city;
  summary.addEventListener('click', e => { const btn = e.target.closest('button[data-category]'); if(btn) changeCategory(btn.dataset.category,true); });
  chips.addEventListener('click', e => { const btn = e.target.closest('button[data-category]'); if(btn) changeCategory(btn.dataset.category); });
  search.addEventListener('input', e => { state.query=e.target.value; render(); });
  location.addEventListener('change', e => { state.city=e.target.value; render(); });
  clear.addEventListener('click',reset);
  document.getElementById('empty-clear-btn').addEventListener('click',reset);
  render();
}

try {
  const response = await fetch('./jobs.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  jobs = await response.json();
  setup();
} catch (error) {
  console.error('Unable to load jobs',error);
  count.textContent = 'Unable to load job data. Please refresh the page.';
  grid.innerHTML = '<p class="error-message">Job data is temporarily unavailable. You can still view roles on the <a href="https://genesys.wd1.myworkdayjobs.com/Genesys?q=India" target="_blank" rel="noopener noreferrer">official Genesys careers page ↗</a>.</p>';
}
