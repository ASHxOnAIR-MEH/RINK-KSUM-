import { oramaSearch } from './src/lib/oramaSearch';
async function test() {
  const r = await oramaSearch('sea weed');
  console.log("Found:", r.totalFound);
  r.results.forEach(res => console.log(res.technology.name));
}
test();
