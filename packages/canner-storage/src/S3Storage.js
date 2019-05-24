// @flow

import Storage from './Storage';
import type { GetUploadUrlType } from './types';

export default class S3Storage extends Storage {
  s3: any;

  constructor({ s3, getUploadUrl }: {s3: any, getUploadUrl: GetUploadUrlType}) {
    super({ getUploadUrl });
    this.s3 = s3;
  }
}
