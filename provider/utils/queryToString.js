/**
 * @flow
 */

export default function queryToString(query?: queryType) {
  if (!query) {
    return 'all';
  }
  // eslint-disable-next-line max-len
  return JSON.stringify(query);
}
