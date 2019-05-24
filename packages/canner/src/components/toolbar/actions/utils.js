import {
  forEach,
} from 'lodash';

export function flattenItems(items) {
  const fields = [];

  function loop(item, keyName = '') {
    let newKeyName = keyName;
    if (item.keyName) {
      newKeyName = `${newKeyName}${newKeyName ? '.' : ''}${item.keyName}`;
    }

    if (item.items && !item.items.type) {
      forEach(item.items, (item) => {
        loop(item, newKeyName);
      });
    } else if (item.items && item.items.type && item.items.items) {
      forEach(item.items.items, (item) => {
        loop(item, newKeyName);
      });
    } else {
      fields.push({
        ...item,
        keyName: newKeyName,
      });
    }
  }

  forEach(items, (item) => {
    loop(item, '');
  });

  return fields;
}
