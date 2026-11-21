export const categories = ['Engineering','AI & Security','Applications','Consulting','Sales'];
export function positionCount(jobs) { return jobs.reduce((sum,job)=>sum+job.positions,0); }
export function cityChoices(jobs) { return [...new Set(jobs.map(j=>j.city))].sort((a,b)=>a.localeCompare(b)); }
export function searchUrl(title) { return 'https://genesys.wd1.myworkdayjobs.com/Genesys?q='+encodeURIComponent(title); }
export function escaped(value) { return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function filterRoles(jobs,filter) {
  const words = filter.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return jobs.filter(job => {
    if (filter.category && job.category !== filter.category) return false;
    if (filter.city && job.city !== filter.city) return false;
    const corpus = [job.title,job.category,job.city,job.location,...job.keywords].join(' ').toLowerCase();
    return words.every(word => corpus.includes(word));
  });
}
