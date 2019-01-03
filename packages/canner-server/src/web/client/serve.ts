import {serve} from './index';
serve()
  .then(stats => {
    console.log(stats.toString());
  })
  .catch(err => {
    console.log(err);
  });