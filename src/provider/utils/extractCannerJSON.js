import {isArray} from 'lodash';
import {UNIQUE_ID} from '../config';

const generateIdPath = (id) => {
  return id.split('/');
};

const extractCannerJSON = (id, cannerJSON) => {
  const idPath = generateIdPath(id);
  if (idPath.length === 1) {
    // example: posts
    // create in a collection
    return {
      id: idPath[0],
      url: idPath[0],
      value: cannerJSON.get(idPath[0]),
    };
  }
  const data = cannerJSON.get(idPath[0]);
  const changedData = cannerJSON.getIn([idPath[0], idPath[1]]);
  if (isArray(data.toJS())) {
    return {
      id: [idPath[0], idPath[1]].join('/'),
      url: `${idPath[0]}/${changedData.get(UNIQUE_ID)}`,
      value: changedData,
    };
  }
  return {
    id: idPath[0],
    url: idPath[0],
    value: {[idPath[1]]: changedData},
  };
};

export default extractCannerJSON;

export {
  generateIdPath,
};
