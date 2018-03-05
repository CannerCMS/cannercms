import Action from './action';

export default class Noop extends Action {
  mutate(data) {
    return data;
  }
}
