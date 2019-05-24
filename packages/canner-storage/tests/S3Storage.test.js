import { S3Storage } from '../src';

jest.mock('axios', () => {
  const request = {
    put: jest.fn().mockImplementation(() => Promise.resolve()),
  };
  return request;
});


describe('S3Storage', () => {
  it('should call getUploadUrl and return link', async () => {
    const data = {
      url: 'url',
    };
    const getUploadUrl = jest.fn().mockImplementation(() => Promise.resolve(data));
    const arg = { s3: {}, getUploadUrl };
    const storage = new S3Storage(arg);
    const onProgress = jest.fn();
    const options = { filename: 'filename' };
    const file = new File(['test'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const result = await storage.upload(file, options, onProgress);
    expect(result.link).toBe(data.url);
  });
});
