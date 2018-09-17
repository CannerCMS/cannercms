jest.mock('axios', () => {
  const request = {
    put: jest.fn().mockImplementation(() => Promise.resolve())
  };
  return request;
});

import {GoogleCloudStorage} from '../src';


describe('GoogleCloudStorage', () => {
  it('should call getUploadUrl and return link', async () => {
    const data = {
      url: 'url',
    };
    const getUploadUrl = jest.fn().mockImplementation(() => Promise.resolve(data));
    const arg = {googleCloud: {}, getUploadUrl: getUploadUrl};
    const storage = new GoogleCloudStorage(arg);
    const onProgress = jest.fn();
    const options = {filename: 'filename'};
    const file = new File(["test"], "test.jpg", {
      type: "image/jpeg",
    });
    const result = await storage.upload(file, options, onProgress);
    expect(result.link).toBe(data.url);
  });
});
