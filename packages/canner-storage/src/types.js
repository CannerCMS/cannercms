// @flow
import Promise from 'promise-polyfill';

export type UploadOptions = {
  filename: string
}

export type ProgressEvent = {
  percent: number,
}

export type OnProgressType = (e: ProgressEvent) => void;

export type GetUploadUrlType = (
  file: File,
  filePath: string
) => Promise<{
  uploadUrl: string,
  publicUrl: string
}>;