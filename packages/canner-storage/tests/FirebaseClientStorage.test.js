import { FirebaseClientStorage } from '../src';


describe('FirebaseClientStorage', () => {
  it('should call getUploadUrl and return link', async () => {
    const firebase = {
      snapshot: {
        ref: {
          getDownloadURL: () => Promise.resolve('downloadUrl'),
        },
      },
    };
    firebase.storage = jest.fn().mockReturnValue(firebase);
    firebase.storage.TaskEvent = { STATE_CHANGED: 'STATE_CHANGED' };
    firebase.ref = jest.fn().mockReturnValue(firebase);
    firebase.child = jest.fn().mockReturnValue(firebase);
    firebase.put = jest.fn().mockReturnValue(firebase);
    firebase.on = jest.fn().mockImplementation((evt, onProgress, reject, resolve) => resolve());

    const arg = { firebase };
    const storage = new FirebaseClientStorage(arg);
    const onProgress = jest.fn();
    const options = { filename: 'filename' };
    const file = new File(['test'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const result = await storage.upload(file, options, onProgress);
    const url = await firebase.snapshot.ref.getDownloadURL();
    expect(result.link).toBe(url);
  });
});
