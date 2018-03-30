// @flow
import type {Map, List} from 'immutable';
import type Pattern from '../app/middleware/bucket/pattern/pattern';
import type Rx from 'rxjs/Rx';
import type RefId from 'canner-ref-id';

declare type BucketType = {
  [namespace: string]: Pattern
}

declare class Bucket {
  bucket: BucketType;
}

declare type filterType = {
  filter: {
    [string]: {
      $eq?: string | number | boolean,
      $equal?: string | number | boolean,
      $gt?: number,
      $gte?: number,
      $lt?: number,
      $lte?: number,
      $in?: Array<number> | Array<string>,
      $contains?: number | string,
      $regex?: RegExp,
    }
  }
}

declare type sortType = {
  sort: {
    [string]: 1 | -1
  }
}

declare type paginationType = {
  pagination: {
    limit: number,
    start: any
  }
}

declare type queryType = filterType | sortType | paginationType;

declare type FetchDef = (key: string, componentId: string, query: any) => Promise<any>;
declare type SubscribeDef = (key: string, componentId: string, type: string, callback: Function) => Promise<*>;
declare type QueryDef = queryType;
declare type RequestDef = (MutateAction) => Promise<*>;
declare type DeployDef = (refId?: RefId, callback?: Function) => Promise<*>;
declare type ResetDef = (refId?: RefId, callback?: Function) => Promise<*>;

declare type CreateArrayItemAction = {
  type: 'CREATE_ARRAY_ITEM',
  payload: {
    key: string, // posts
    id: string, // UNIQUE_ID
    value: any,
    mutatedValue?: any
  }
}

declare type CreateArrayNestedItemAction = {
  type: 'CREATE_ARRAY_NESTED_ITEM',
  payload: {
    key: string, // posts
    id: string, // UNIQUE_ID
    path: string, // category
    value: any,
    mutatedValue?: any
  }
}

declare type CreateObjectNestedItemAction = {
  type: 'CREATE_OBJECT_NESTED_ITEM',
  payload: {
    key: string, // info
    path: string, // category
    value: any,
    mutatedValue?: any
  }
}

declare type UpdateArrayAction = {
  type: 'UPDATE_ARRAY',
  payload: {
    key: string, // posts
    id: string, // id
    path: string, // category/ID
    value: any,
    mutatedValue?: any
  }
}

declare type UpdateObjectAction = {
  type: 'UPDATE_OBJECT',
  payload: {
    key: string, // info
    path: string, // name
    value: any,
    mutatedValue?: any
  }
}

declare type DeleteArrayItemAction = {
  type: 'DELETE_ARRAY_ITEM',
  payload: {
    key: string, // info
    id: string,
    mutatedValue?: any
  }
}

declare type DeleteArrayNestedItemAction = {
  type: 'DELETE_ARRAY_NESTED_ITEM', // posts/ID/category/0
  payload: {
    key: string, // posts
    id: string, // ID
    path: string, // category/0
    mutatedValue?: any
  }
}

declare type DeleteObjectNestedItemAction = {
  type: 'DELETE_OBJECT_NESTED_ITEM',
  payload: {
    key: string, // info
    path: string, // category/0
    mutatedValue?: any
  }
}

declare type SwapArrayItemAction = {
  type: 'SWAP_ARRAY_ITEM', // posts/ID posts/ID
  payload: {
    key: string,
    id: string,
    path: [string, string],
    mutatedValue?: any
  }
}

declare type SwapArrayNestedItemAction = {
  type: 'SWAP_ARRAY_NESTED_ITEM', //  posts/ID/category/ID1 posts/ID/category/ID2
  payload: {
    key: string,
    id: string,
    path: [string, string],
    mutatedValue?: any
  }
}

declare type SwapObjectNestedItemAction = {
  type: 'SWAP_OBJECT_NESTED_ITEM', //  info/category/ID1 info/category/ID2
  payload: {
    key: string,
    path: [string, string],
    mutatedValue?: any
  }
}

declare type NoopAction = {
  type: 'NOOP'
}

declare type MutateAction = CreateArrayItemAction |
  CreateArrayNestedItemAction |
  CreateObjectNestedItemAction |
  UpdateArrayAction |
  UpdateObjectAction |
  DeleteArrayItemAction |
  DeleteArrayNestedItemAction |
  DeleteObjectNestedItemAction |
  SwapArrayItemAction |
  SwapArrayNestedItemAction |
  SwapObjectNestedItemAction |
  NoopAction;

declare type ArrayAction = CreateArrayItemAction |
CreateArrayNestedItemAction |
UpdateArrayAction |
DeleteArrayItemAction |
DeleteArrayNestedItemAction |
SwapArrayItemAction |
SwapArrayNestedItemAction

type transformedAction = CreateArrayItemAction |
  UpdateArrayAction |
  DeleteArrayItemAction |
  UpdateObjectAction |
  NoopAction;

// mutateRequest
// mutateType: 'update' | 'create' | 'delete' | 'swap'
declare type writeRequest = {
  key: string,
  id?: string,
  type: 'write',
  action: MutateAction,
}

declare type fetchRequest = {
  key: string,
  type: 'fetch',
  query: queryType,
  componentId: string // request is from
}

declare type deployRequest = {
  key: string,
  type: 'deploy',
  id?: string,
  actions?: Array<transformedAction>
}

declare type SubjectType = 'value' | 'childAdded' | 'childRemoved' | 'childChanged';

declare type subscribeRequest = {
  key: string,
  type: 'subscribe',
  observer: Rx.Observer,
  componentId: string,
  subjectType: SubjectType
}

declare type Mutate = (data: List<*>, action: MutateAction, mutate?: Mutate) => List<*>
  | (Map<string, *>, MutateAction) => Map<string, *>

declare type ContextType = {
  request: writeRequest | fetchRequest | deployRequest | subscribeRequest,
  response: {
    body: Map<string, any>,
    pagination: {
      // number pagination
      goTo?: number => queryType,
      page?: number,
      totalNumber?: number,
      totalPage?: number,
      // cursor pagination
      next?: () => queryType,
      prev?: () => queryType
    },
    replace?: Array<{
      path: string, // which path should be change
      data: {
        from: string,
        to: string
      }
    }>,
    totalPage: number,
    subscription: any,
    actionsNumber: number,
    mutate: Mutate,
    actions?: Array<MutateAction>
  }
}

declare type NextType = void => any

// for Intl
declare var Intl: any;


declare type NodeType = {
  name?: string,
  nodeType: string,
  [string]: any
}

declare type ParentNode = {
  children: Array<NodeType>
} & NodeType

declare type Tree = {
  [key: string]: ParentNode
}

declare type Schema = {
  [string]: any
}

declare type Path = {
  parent: ?ParentNode,
  node: NodeType,
  [string]: any
}

declare type VistorFunc = Path => void;

declare type Visitor = {
  [string]: {
    enter: Array<VistorFunc>,
    exit: Array<VistorFunc>
  }
}

declare type VisitorObj = {
  enter?: VistorFunc,
  exit?: VistorFunc
}

declare type InputVisitor = {
  [string]: VisitorObj | VistorFunc
}

declare type Route = string;

