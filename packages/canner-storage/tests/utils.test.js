import {getUploadPercent} from '../src/utils';


describe('getUploadPercent', () => {
  it('should get 80', async () => {
    const e = {
      position: 80,
      totalSize: 100
    };
    expect(getUploadPercent(e)).toBe(80);
  });

  it('should get 20', async () => {
    const e = {
      loaded: 20,
      total: 100
    };
    expect(getUploadPercent(e)).toBe(20);
  });
});
