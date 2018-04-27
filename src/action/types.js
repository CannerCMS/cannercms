// @flow

export type UpdateType = 'create' | 'update' | 'delete' | 'swap' | 'connect' | 'disconnect';

export type ArrayActionType = 'UPDATE_ARRAY' | 'CREATE_ARRAY' | 'DELETE_ARRAY'
export type ConnectActionType = 'CONNECT' | 'DISCONNECT' | 'CREATE_AND_CONNECT' | 'DISCONNECT_AND_DELETE';
export type ObjectActionType = 'UPDATE_OBJECT';
export type NoopType = 'NOOP';
export type ActionType = ArrayActionType | ConnectActionType | ObjectActionType | NoopType;

export type Action<T> = {
  type: T,
  payload: {
    key?: string,
    id?: string,
    path?: string,
    value?: *
  }
}


export interface Pattern<T> {
  actions: Array<T>;

  addAction(action: T): void;
  mergeAction(): Array<T>;
}
