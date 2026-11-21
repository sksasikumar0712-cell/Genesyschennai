import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { positionCount,categories } from '../src/logic.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jobs = JSON.parse(fs.readFileSync(path.join(root,'data/jobs.json'),'utf8'));
if (!Array.isArray(jobs) || jobs.length !== 21) throw new Error('Snapshot must have 21 unique role titles');
if (positionCount(jobs) !== 26) throw new Error('Snapshot must have exactly 26 shown positions');
const ids = new Set();
for (const job of jobs) {
  if (ids.has(job.id)) throw new Error(`Duplicate role ID: ${job.id}`);
  ids.add(job.id);
  if (!categories.includes(job.category)) throw new Error(`Unknown category: ${job.category}`);
  for (const key of ['id','title','category','location','city','source']) if (typeof job[key] !== 'string' || !job[key].trim()) throw new Error(`Missing ${key}`);
  if (!Number.isSafeInteger(job.positions) || job.positions < 1 || job.positions > 10) throw new Error(`Invalid positions: ${job.id}`);
  if (!Array.isArray(job.keywords)||job.keywords.some(v=>typeof v !== 'string')) throw new Error('Invalid keywords');
  if (!['presentation','official-posting','related-official-posting'].includes(job.source)) throw new Error('Invalid source');
  if (job.source === 'official-posting' && !job.url) throw new Error(`Missing official posting for ${job.id}`);
  if (job.url) {
    const parsed = new URL(job.url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'genesys.wd1.myworkdayjobs.com' || !/\/job\//i.test(parsed.pathname)) throw new Error(`Non-official role URL: ${job.id}`);
  }
}
const counts = Object.fromEntries(categories.map(c => [c,positionCount(jobs.filter(j=>j.category===c))]));
const expected = {Engineering:12,'AI & Security':3,Applications:2,Consulting:6,Sales:3};
if (JSON.stringify(counts)!==JSON.stringify(expected)) throw new Error('Category totals differ from presentation');
const out = path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync(path.join(root,'src'),out,{recursive:true});
fs.copyFileSync(path.join(root,'data/jobs.json'),path.join(out,'jobs.json'));
console.log(`Built dist with ${jobs.length} unique titles, ${positionCount(jobs)} positions; categories:`,counts);
