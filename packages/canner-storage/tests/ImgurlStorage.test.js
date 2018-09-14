jest.mock('axios', () => {
  const data = {
    link: 'test'
  };
  const request = {
    post: jest.fn().mockImplementation(() => Promise.resolve(data))
  };
  return request;
});

import {ImgurStorage} from '../src';


describe('ImgurStorage', () => {
  it('should call axios and return link', async () => {
    const arg = {clientId: 'clientId', mashapeKey: 'mashapeKey'};
    const storage = new ImgurStorage(arg);
    const onProgress = jest.fn();
    const options = {filename: 'filename'};
    const file = new File(["test"], "test.jpg", {
      type: "image/jpeg",
    });
    const result = await storage.upload(file, options, onProgress);
    expect(result.link).toBe('test');
  });

  it('should get MASHAPE_API', async () => {
    const arg = {clientId: 'clientId', mashapeKey: 'mashapeKey'};
    const storage = new ImgurStorage(arg);

    const result = await storage.getUploadUrl();
    expect(result).toBe('https://imgur-apiv3.p.mashape.com/3/image');
  });

  it('should get IMGUR_IMAGE_API', async () => {
    const arg = {clientId: 'clientId'};
    const storage = new ImgurStorage(arg);

    const result = await storage.getUploadUrl();
    expect(result).toBe('https://api.imgur.com/3/image/');
  });
});
