// @flow

export type NodeType = {
  name?: string,
  nodeType: string,
  [string]: any
}

export type ParentNode = NodeType & {
  children: Array<NodeType>
}

export type Tree = {
  [key: string]: ParentNode
}

export type Schema = {
  [string]: any
}

export type Path = {
  parent: ?ParentNode,
  node: NodeType,
  [string]: any
}

export type VistorFunc = Path => void;

export type Visitor = {
  [string]: {
    enter: Array<VistorFunc>,
    exit: Array<VistorFunc>
  }
}

export type VisitorObj = {
  enter?: VistorFunc,
  exit?: VistorFunc
}

export type InputVisitor = {
  [string]: VisitorObj | VistorFunc
}

export type Route = string
