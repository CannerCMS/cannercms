import {OnDeployManager} from '../../src/onDeployManager';

describe('onDeployManager class', () => {
  let onDeployManager;

  beforeEach(() => {
    onDeployManager = new OnDeployManager(); 
  });

  it('registerCallback', () => {
    const callback = () => {};
    onDeployManager.registerCallback('posts', 'id1', callback);
    expect(onDeployManager._map.posts.id1).toBe(callback);
  });

  it('findCallback', () => {
    const callback = () => {};
    onDeployManager.registerCallback('posts', 'id1', callback);
    expect(onDeployManager.findCallback('posts', 'id1')).toBe(callback);
  });

  it('unregisterCallback', () => {
    const callback = () => {};
    onDeployManager.registerCallback('posts', 'id1', callback);
    onDeployManager.unregisterCallback('posts', 'id1');
    expect(onDeployManager._map.posts.id1).toBeUndefined();
  });
});
