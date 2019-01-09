import {build} from './index';
import path from 'path';

build()
  .then(stats => {
    console.log('success', stats.toString());
  })
  .catch(err => {
    console.log('error', err);
  });