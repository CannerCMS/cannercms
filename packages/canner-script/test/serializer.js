export default {
  print(val) {
    // eslint-disable-next-line
    val = loop(val);
    return JSON.stringify(val, null, 2);
  },
  test(val) {
    return val && typeof val === 'object';
  },
};

function renderVal(val) {
  return {
    nodeType: val.nodeType,
    component: typeof val.component === 'string' || !val.component ? val.component : String(val.component),
    keyName: val.keyName,
    childrenName: val.childrenName && `[${val.childrenName.join(',')}]`,
    hocs: (val.hocs && val.hocs.join) && `[${val.hocs.join(',')}]`,
    children: val.children,
  };
}

function loop(val) {
  if (val.nodeType) {
    if (val.children) {
      // eslint-disable-next-line
      val.children = val.children.map(child => loop(child));
    }
    return renderVal(val);
  }
  return mapValues(val, loop);
}

function mapValues(obj, func) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key] = func(obj[key]);
  });
  return newObj;
}
