import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import generate from 'babel-generator';
import * as t from 'babel-types';
import template from 'babel-template';
import {componentMap} from './utils'
const UNEXISTING = 'UNEXISTING';
const buildDynamicImport = template(`
  new Promise((resolve) => {
    require.ensure([], (require) => {
      resolve(require(PACKAGE_NAME));
    });
  })
`);

const buildRequire = template(`
  require(DEF_FILE).default ? require(DEF_FILE).default : require(DEF_FILE)
`)

export default function loader(source, map, meta) {
  const ast = babylon.parse(source);
  const that = this;
  const callback = this.async();
  const promises = [];
  // first traverse, we collect all resolve promise and store in promises array
  traverseAst(
    ast,
    ({packageName}) => {
      promises.push(generatePaths(packageName, that));
    },
    ({packageName}) => {
      promises.push(generatePaths(packageName, that));
    }
  );
  generate(ast, {}, source).code;

  // second traverse, we get the generatePaths from the promises array
  Promise.all(promises).then(paths => {
    const copyPaths = paths.slice();
    traverseAst(
      ast,
      ({path, type}) => {
        const {
          absPackageName,
          absPackageJson,
          absDefJs,
          packageName
        } = copyPaths.shift();
        path.get('arguments.1').replaceWith(
          t.objectExpression([
            t.objectProperty(t.stringLiteral('packageName'), t.stringLiteral(packageName)),
            t.objectProperty(t.stringLiteral('loader'), buildLoader(absPackageName)),
            t.objectProperty(t.stringLiteral('builder'), buildBuilder(absDefJs, that)),
            ...buildCannerConfig(absPackageJson, type)
          ])
        );
      },
      ({propsNode, type}) => {
        const {
          absPackageName,
          absPackageJson,
          absDefJs,
          packageName
        } = copyPaths.shift();
        propsNode.node.properties.push(t.objectProperty(t.stringLiteral('packageName'), t.stringLiteral(packageName)));
        propsNode.node.properties.push(t.objectProperty(t.stringLiteral('loader'), buildLoader(absPackageName)));
        propsNode.node.properties.push(t.objectProperty(t.stringLiteral('builder'), buildBuilder(absDefJs, that)));
        propsNode.node.properties = propsNode.node.properties.concat(buildCannerConfig(absPackageJson, type));

      }
    );
    const result = generate(ast, {}, source).code;
    callback(null, result, map, meta);
  });
}

function traverseAst(ast, nullPropsCallback, ObjectPropsCallback) {
  traverse(ast, {
    CallExpression(path) {
      let typeNode, propsNode, type, packageName;
      if (path.node.arguments.length < 2) {
        return;
      }
      typeNode = path.get('arguments.0');
      propsNode = path.get('arguments.1');
      if (typeNode.isStringLiteral() && propsNode.isNullLiteral()) {
        type = typeNode.node.value;
        packageName = componentMap.get('type');
        if (!packageName) {
          return;
        }
        nullPropsCallback({
          packageName,
          type,
          propsNode,
          path
        });
      }

      if (typeNode.isStringLiteral() && propsNode.isObjectExpression()) {
        type = typeNode.node.value;
        const properties = getProperties(propsNode);
        if ('packageName' in properties) {
          packageName = properties.packageName;
        } else {
          packageName = componentMap.get(type, properties.ui);
        }
        if (!packageName) {
          return;
        }
        ObjectPropsCallback({
          packageName,
          type,
          path,
          propsNode
        });
      }
    }
  });
}

function getProperties(propsNode) {
  return propsNode.node.properties.reduce((result, property) => {
    return {
      ...result,
      [getPropertyKey(property)]: getPropertyValue(property)
    }
  }, {});
}

function getPropertyKey(property) {
  return property.key.name;
}

function getPropertyValue(property) {
  if (t.isStringLiteral(property.value)) {
    return property.value.value;
  }
  // for now, we only need ui and packagename, so If it's not string literal we can ignore it.
  return undefined;
}

function absPath(path, context) {
  return new Promise(resolve => {
    context.resolve(context.context, path, (err, result) => {
      if (err) {
        resolve(UNEXISTING);
      }
      resolve(result);
    });
  })
}

export async function generatePaths(sourcePkgName, context) {
  let absPackageName = sourcePkgName;
  let absPackageJson = `${sourcePkgName}/package.json`;
  let absDefJs = `${sourcePkgName}/canner.def.js`;
  absPackageName = await absPath(absPackageName, context);
  absPackageJson = await absPath(absPackageJson, context);
  absDefJs = await absPath(absDefJs, context);
  return {
    absPackageName,
    absPackageJson,
    absDefJs,
    packageName: sourcePkgName
  }
}

function buildLoader(packageName) {
  return buildDynamicImport({
    PACKAGE_NAME: t.stringLiteral(packageName)
  }).expression;
}

function buildBuilder(defFile) {
  if (defFile === UNEXISTING) {
    return t.nullLiteral();
  }
  return buildRequire({
    DEF_FILE: t.stringLiteral(defFile)
  }).expression;
}

function buildCannerConfig(packageJson, type) {
  let canner = {}, properties = [];
  try {
    canner = require(packageJson).canner || {};
  } catch (e) {
    canner = {};
  }
  Object.keys(canner).forEach(key => {
    if (key === 'cannerDataType') {
      if (type !== 'json') { // the component of json type is same as object, but the type can't be changed
        properties.push(t.objectProperty(t.stringLiteral('type'), t.stringLiteral(canner[key])));
      }
    } else if (typeof canner[key] === 'string'){
      properties.push(t.objectProperty(t.stringLiteral(key), t.stringLiteral(canner[key])));
    } else if (typeof canner[key] === 'number'){
      properties.push(t.objectProperty(t.stringLiteral(key), t.numberLiteral(canner[key])));
    } else if (typeof canner[key] === 'boolean'){
      properties.push(t.objectProperty(t.stringLiteral(key), t.booleanLiteral(canner[key])));
    } else {
      throw new Error(`Not support the type of object and array config in canner yet, but got key: ${key} with value: ${canner[key]}.`);
    }
  });
  return properties;
}
