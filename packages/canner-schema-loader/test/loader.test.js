/**
 * @jest-environment node
 */

import compiler from './compiler';

test('Inserts schema and outputs JSONSchema and componentTree', async () => {
  const stats = await compiler('test.schema.js', { test: true });
  const output = stats.toJson().modules.find(module => module.name === './test.schema.js').source
    // ignore different path for CI
    .replace(new RegExp(process.cwd(), 'g'), 'IGNORED_PATH');
  expect(output).toMatchSnapshot();
  // const output2 = stats.toJson().modules.find(module => module.name === './schema/string.schema.js').source;
  // expect(output2).toMatchSnapshot();
  // expect(true).toBe(true);
}, 100000);
