// @flow

export type UploadOptions = {
  filename: string
}

export type ProgressEvent = {
  percent: number,
}

export type OnProgressType = (e: ProgressEvent) => void;
