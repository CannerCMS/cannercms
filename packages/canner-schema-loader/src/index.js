import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import generate from 'babel-generator';
import * as t from 'babel-types';
import template from 'babel-template';
import fs from 'fs';
import path from 'path';
import {componentMap} from './utils'

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

export default function loader(source) {
  const ast = babylon.parse(source);
  const that = this;
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
        packageName = absPackageName(packageName, that);
        path.get('arguments.1').replaceWith(
          t.objectExpression([
            t.objectProperty(t.stringLiteral('packageName'), t.stringLiteral(packageName)),
            t.objectProperty(t.stringLiteral('loader'), buildLoader(packageName)),
            t.objectProperty(t.stringLiteral('builder'), buildBuilder(packageName)),
            ...builderCannerConfig(packageName)
          ])
        );
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
        packageName = absPackageName(packageName, that);
        propsNode.node.properties.push(t.objectProperty(t.stringLiteral('packageName'), t.stringLiteral(packageName)));
        propsNode.node.properties.push(t.objectProperty(t.stringLiteral('loader'), buildLoader(packageName)));
        propsNode.node.properties.push(t.objectProperty(t.stringLiteral('builder'), buildBuilder(packageName)));
        propsNode.node.properties = propsNode.node.properties.concat(builderCannerConfig(packageName));
      }
    }
  });
  return generate(ast, {}, source).code;
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

export function absPackageName(sourcePkgName, context) {
  let packageName = sourcePkgName;
  if (packageName.startsWith('.') || packageName.startsWith(path.sep)) {
    // customize component
    packageName = path.resolve(context.context, sourcePkgName);
  } else {
    // deployed component
    const paths = require.resolve(packageName).split(path.sep);
    const dirPathIndex = paths.indexOf(packageName);
    packageName = paths.slice(0, dirPathIndex - 1).join(path.sep);
  }
  return packageName;
}

function buildLoader(packageName) {
  return buildDynamicImport({
    PACKAGE_NAME: t.stringLiteral(packageName)
  }).expression;
}

function buildBuilder(packageName) {
  let builder;
  const defFile = `${packageName}/canner.def.js`;
  if (fs.existsSync(defFile)) {
    // to check defFile is exist or not, if not this line will throw an error
    builder = buildRequire({
      DEF_FILE: t.stringLiteral(defFile)
    }).expression;
  } else {
    builder = t.nullLiteral();
  }
  return builder;
}

function builderCannerConfig(packageName) {
  let canner = {}, properties = [];
  try {
    canner = require(`${packageName}/package.json`).canner || {};
  } catch (e) {
    canner = {};
  }
  Object.keys(canner).forEach(key => {
    if (key === 'cannerDataType') {
      properties.push(t.objectProperty(t.stringLiteral('type'), t.stringLiteral(canner[key])));
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
