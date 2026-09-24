import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const projectRoute = '/projects/screenreel';
const showcaseUrl = 'https://alafazam.com/screenreels/';

test('ScreenReel is linked from the portfolio and prepared for a future site build', async () => {
  const [project, packageSource, sitemap] = await Promise.all([
    readFile(new URL('../src/content/projects/screenreel.md', import.meta.url), 'utf8'),
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
    readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
  ]);

  const siteConfig = JSON.parse(packageSource);
  assert.match(project, /^name: ScreenReel$/m);
  assert.match(project, /^category: Builds$/m);
  assert.ok(project.includes(`link: ${showcaseUrl}`));
  assert.ok(siteConfig.reactSnap.include.includes(projectRoute));
  assert.ok(sitemap.includes(`<loc>https://alafazam.com${projectRoute}</loc>`));
});
