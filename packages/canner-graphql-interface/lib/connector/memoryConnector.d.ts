import { Connector, Pagination } from './types';
import { Field } from 'canner-graphql-utils/lib/schema/types';
interface Hooks {
    afterListResolveByUnique?: (key: string, row: any) => void;
    afterListResolveQuery?: (key: string, rows: any) => void;
    afterResolveToOne?: (to: string, id: string, row: any) => void;
}
export default class MemoryConnector implements Connector {
    private db;
    private hooks;
    constructor({ defaultData, hooks }: {
        defaultData?: any;
        hooks?: Hooks;
    });
    listResolveByUnique({ key, field, schema }: {
        key: string;
        field: {
            [key: string]: any;
        };
        schema: Field;
    }): Promise<any>;
    listResolveQuery({ key, where, order, pagination, schema }: {
        key: string;
        where: any;
        order: any;
        pagination: Pagination;
        schema: Field;
    }): Promise<any>;
    hasNextPage(): Promise<void>;
    resolveToOne({ from, to, id, schema }: {
        from: string;
        to: string;
        id: string;
        schema: Field;
    }): Promise<any>;
    resolveToMany({ from, to, ids, pagination, schema }: {
        from: string;
        to: string;
        ids: [string];
        pagination: Pagination;
        schema: Field;
    }): Promise<any>;
    mapResolve(key: string, schema: Field): Promise<any>;
    mapUpdate(key: string, payload: any, schema: Field): Promise<any>;
    listCreate(key: string, payload: any, schema: Field): Promise<any>;
    listUpdate(key: string, where: any, payload: any, schema: Field): Promise<any>;
    listDelete(key: string, where: any, schema: Field): Promise<any>;
    private setDefault;
}
export {};
