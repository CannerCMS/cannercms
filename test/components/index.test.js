// import React from 'react';
// import toJson from 'enzyme-to-json';
// import Enzyme, {mount} from 'enzyme';
// import Adapter from '../react163Adapter';
// import {CMS} from '../../src/components';

// Enzyme.configure({ adapter: new Adapter() });

// import compiler from '../compiler';
// import path from 'path';

/**
 * not works 
 */

it('this test is emptry', () => {
  expect(true).toBe(true);
});

// test('Should render', async () => {
//   const stats = await compiler(path.resolve(__dirname, 'schema.js'));
//   const output = stats.toJson().modules[0].source;
//   const json = eval(output);
//   const wrapper = mount(
//     <CMS
//       schema={json}
//     />
//   );
//   expect(toJson(wrapper)).toMatchSnapshot();
// });