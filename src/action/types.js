// @flow

export type UpdateType = 'create' | 'update' | 'delete' | 'swap' | 'connect' | 'disconnect';

export type ArrayActionType = 'UPDATE_ARRAY' | 'CREATE_ARRAY' | 'DELETE_ARRAY'
export type ConnectActionType = 'CONNECT' | 'DISCONNECT' | 'CREATE_AND_CONNECT' | 'DISCONNECT_AND_DELETE';
export type ObjectActionType = 'UPDATE_OBJECT';
export type ActionType = ArrayActionType | ConnectActionType | ObjectActionType;

export type Action = {
  type: ActionType,
  payload: {
    key: string,
    id?: string,
    path?: string,
    value?: *
  }
}
