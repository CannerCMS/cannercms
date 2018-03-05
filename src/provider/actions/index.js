import CollectionCreate from './collectionCreate';
import CollectionUpdate from './collectionUpdate';
import CollectionDelete from './collectionDelete';
import MapUpdate from './mapUpdate';
import Noop from './noop';
import Action from './action';
import mutate from './mutate';

const types = {
  collection: 'collection',
  map: 'map',
};

export default {
  CollectionCreate,
  CollectionUpdate,
  CollectionDelete,
  MapUpdate,
  Noop,
  types,
  Action,
  mutate,
};
