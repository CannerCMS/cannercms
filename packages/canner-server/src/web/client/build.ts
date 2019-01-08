import {build} from './index';
build()
  .then(stats => {
    console.log('success', stats.toString());
  })
  .catch(err => {
    console.log('error', err);
  });