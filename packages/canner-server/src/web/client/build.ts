import {build} from './index';
build()
  .then(stats => {
    console.log(stats.toString());
  })
  .catch(err => {
    console.log(err);
  });