// @flow

import type {CannerSchema} from '../flow-types';
import {componentMap} from '../utils';

export default class BasicModel {
  attributes: {
    keyName: string;
    name: string;
    ui: ?string;
    uiParams: Object;
    packageName: ?string;
    title: string;
    description: ?string;
    type: string;
    loader: string;
  }

  attributes = {}
  constructor(tagName: string, attrs: CannerSchema) {
    const ui = attrs.ui || this.getDefaultUI();
    const type = attrs.type || tagName;
    this.attributes = {
      ...attrs,
      ui,
      title: attrs.title || '',
      description: attrs.description || '',
      uiParams: attrs.uiParams || {},
      type,
      packageName: attrs.packageName || componentMap.get(type, ui)
    }
  }

  toJson = (): Object => {
    return {
      ...this.attributes
    }
  }

  getDefaultUI() {
    return 'default';
  }

  withToolBar(children: Array<Object>) {
    const toolbar = children.find((child) => child.__TOOLBAR__);

    if (toolbar) {
      this.attributes = {
        ...this.attributes,
        toolbar
      };
    }
  }
}