/**
 * @flow
 */

export interface Middleware {
  handleChange(ctx: ContextType, next: NextType): any;
}
