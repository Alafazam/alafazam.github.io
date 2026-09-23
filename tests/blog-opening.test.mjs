import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import MarkdownIt from 'markdown-it';

const articleUrl = new URL('../src/content/blog/the-demo-is-the-spec.md', import.meta.url);
const source = await readFile(articleUrl, 'utf8');
const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const html = new MarkdownIt({ html: true }).render(body);

test('the real-world opening is distinct from the article argument', () => {
  const openingStart = html.indexOf('<div class="story-lede">');
  const openingEnd = html.indexOf('</div>', openingStart);
  const transition = html.indexOf('That changed how I think about product specifications:');

  assert.ok(openingStart >= 0, 'opening treatment is rendered');
  assert.ok(openingEnd > openingStart, 'opening treatment has a closing boundary');
  assert.ok(html.includes('<p class="story-lede-label">From the work</p>'));
  assert.ok(html.includes('<p class="story-lede-turn">Using the product did.</p>'));
  assert.ok(transition > openingEnd, 'the argument follows the highlighted scene');
});
