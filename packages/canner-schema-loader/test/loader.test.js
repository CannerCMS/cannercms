import compiler from './compiler.js';
import path from 'path';
test('Inserts schema and outputs JSONSchema and componentTree', async () => {
  // FIX: breaks at first install
  const stats = await compiler('test.schema.js', {test: true});
  const output = stats.toJson().modules.find(module => module.name === './test.schema.js').source
    .replace(new RegExp(path.resolve('../../'), 'g'), 'IGNORED_PATH');
  expect(output).toMatchSnapshot();
  // const output2 = stats.toJson().modules.find(module => module.name === './schema/string.schema.js').source;
  // expect(output2).toMatchSnapshot();
  // expect(true).toBe(true);
}, 60000);