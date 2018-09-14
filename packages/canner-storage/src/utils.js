// @flow

export function getUploadPercent(e: any) {
  const done = e.position || e.loaded;
  const total = e.totalSize || e.total;
  const percent = done / total * 100;
  return percent;
}
