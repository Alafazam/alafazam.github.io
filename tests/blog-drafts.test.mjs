import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const draftsDirectory = new URL('../src/content/blog/_drafts/', import.meta.url);
const distDirectory = new URL('../dist/', import.meta.url);

test('draft outlines stay out of the production bundle', async () => {
  const filenames = (await readdir(draftsDirectory)).filter((name) => name.endsWith('.md') && name !== 'README.md');
  assert.ok(filenames.length > 1, 'there are multiple drafts to review');

  const titles = await Promise.all(filenames.map(async (filename) => {
    const source = await readFile(new URL(filename, draftsDirectory), 'utf8');
    assert.match(source, /^draft: true$/m, `${filename} is marked as a draft`);
    const title = source.match(/^title: "(.+)"$/m)?.[1];
    assert.ok(title, `${filename} has a title`);
    return title;
  }));

  const outputFiles = await readdir(distDirectory, { recursive: true });
  const textFiles = outputFiles.filter((name) => /\.(html|js|css|xml)$/.test(name));
  const output = (await Promise.all(textFiles.map((name) => readFile(new URL(name, distDirectory), 'utf8')))).join('\n');

  for (const title of titles) {
    assert.ok(!output.includes(title), `production output does not contain draft title: ${title}`);
  }
});
