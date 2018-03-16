import {includes} from 'lodash';
import invariant from 'invariant';

const generateId = function(originId, currentId, type) {
  const acceptType = ['object', 'array', 'string'];
  invariant(
    includes(acceptType, type),
    `generate id type need to be one of ${generateId}`
  );
  let newId;
  // 如果尚未有id，直接傳回currentId
  if (originId.length === 0) {
    return currentId;
  }

  if (type === 'array') {
    newId = `${originId}/${currentId}`;
  } else {
    newId = `${originId}/${currentId}`;
  }
  return newId;
};

export default generateId;
