export type Action = {
  type: string;
  payload: any;
}

type Callback = (data: any) => void;

type ListenerId = string;

export type Reducer = (data: any, action: Action) => any;
export type Listener = {
  id: ListenerId;
  callback: Callback;
};
export type Listeners = Record<string, Array<Listener>>;

export interface CacheI {
  isCached: (key: string) => boolean;
  mutate: (key: string, actions: Array<Action> | Action) => void;
  setData: (key: string, data: any) => void;
	getData: (key: string) => any;
	subscribe: (key: string, callback: Callback) => ListenerId;
  unsubscribe: (key: string, listenerId: ListenerId) => void;
  publish: (key: string) => void;
}