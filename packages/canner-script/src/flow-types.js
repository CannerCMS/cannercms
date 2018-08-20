// @flow

export type CannerSchema = {
  keyName: string,
  type: string,
  ui?: string,
  title?: string,
  description?: string,
  packageName?: string,
  component?: any,
  builder?: Function,
  uiParams?: Object,
  graphql?: String,
  items?: {
    [key: string]: CannerSchema
  } | CannerSchema,
  [string]: any
}

export type Path = {
  route: string,
  node: Node,
  parent: Node,
  tree: any
}

export type Node = CannerSchema & {
  children?: Array<Node>
}

export type Props = {
  attributes: Object,
  children: any
}
