import { Context, ContextFunction } from 'apollo-server-core';
import { Logger } from '../common/interface';

export interface GqlifyConfig {
  schemaPath?: string;
  dataSources?: Record<string, any>;
  context?: Context<any> | ContextFunction<any>;
  logger?: Logger;
}
