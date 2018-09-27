import {
  forEach
} from 'lodash';
export function flattenItems(items) {
  const fields = [];

  function loop(item, keyName = '') {
    if (item.keyName) {
      keyName = `${keyName}${keyName ? '.' : ''}${item.keyName}`;
    }

    if (item.items && !item.items.type) {
      forEach(item.items, item => {
        loop(item, keyName);
      });
    } else if (item.items && item.items.type && item.items.items) {
      forEach(item.items.items, item => {
        loop(item, keyName);
      })
    } else {
      fields.push({
        ...item,
        keyName
      });
    }
  }

  forEach(items, item => {
    loop(item, '');
  });

  return fields;
}
