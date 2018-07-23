/** @jsx builder */
/* eslint-disable react/prop-types */

import builder from 'canner-script';
import Posts from './schema/posts.schema.js';
import Authors from './schema/authors.schema.js';
import Categories from './schema/categories.schema.js';

export default (
  <root>
    <Posts/>
    <Authors/>
    <Categories />
  </root>
);
