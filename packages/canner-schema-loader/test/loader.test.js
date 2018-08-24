import compiler from './compiler.js';
test('Inserts schema and outputs JSONSchema and componentTree', async () => {
  // FIX: breaks at first install
  const stats = await compiler('test.schema.js');
  const output = stats.toJson().modules.find(module => module.name === './test.schema.js').source;
  expect(output).toMatchSnapshot();
  // const output2 = stats.toJson().modules.find(module => module.name === './schema/string.schema.js').source;
  // expect(output2).toMatchSnapshot();
  // expect(true).toBe(true);
}, 60000);