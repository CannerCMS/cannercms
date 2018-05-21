// @flow

export type QueryObject = null | {
  fields?: {
    [string]: QueryObject
  },
  args?: {
    [string]: any,
  },
  isPlural?: boolean,
  connection?: boolean,
  alias?: string
}