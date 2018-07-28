import {OnDeployManager} from '../../src/onDeployManager';

describe('onDeployManager class', () => {
  let onDeployManager;

  beforeEach(() => {
    onDeployManager = new OnDeployManager(); 
  });

  it('registerCallback', () => {
    const callback = () => {};
    const callbackId = onDeployManager.registerCallback('posts', callback);
    expect(onDeployManager._map.posts[callbackId]).toEqual(callback);
  });

  it('findCallback', () => {
    const callback = () => {};
    onDeployManager.registerCallback('posts', callback);
    expect(onDeployManager.findCallback('posts')).toEqual([callback]);
  });

  it('unregisterCallback', () => {
    const callback = () => {};
    const callbackId = onDeployManager.registerCallback('posts', callback);
    onDeployManager.unregisterCallback('posts', callbackId);
    expect(onDeployManager._map.posts).toEqual({});
  });
});
