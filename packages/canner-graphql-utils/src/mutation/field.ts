import { Connector } from '../types';

export interface MutationField<R> {
  preResolveCreate(connector: Connector): Promise<any>;
  preResolveUpdate(rowId: string, connector: Connector): Promise<any>;
  preResolveMapUpdate(connector: Connector): Promise<any>;
  preResolveDelete(rowId: string, connector: Connector): Promise<any>;
  resolve(): R;
}
