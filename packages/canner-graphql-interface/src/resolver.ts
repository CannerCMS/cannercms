// generate resolvers
import { Connector, Pagination } from './connector/types';
import isUndefined from 'lodash/isUndefined';
import forEach from 'lodash/forEach';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';
import last from 'lodash/last';
import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';
import * as pluralize from 'pluralize';
import { paginator } from 'canner-graphql-utils';
import { MutationField } from 'canner-graphql-utils/lib/mutation/field';
import ToManyField from 'canner-graphql-utils/lib/mutation/toManyField';
import ToOneField from 'canner-graphql-utils/lib/mutation/toOneField';
import { createSchema } from 'canner-graphql-utils/lib/schema/utils';
import { Field, Types } from 'canner-graphql-utils/lib/schema/types';
import RelationField from 'canner-graphql-utils/lib/schema/relationField';

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
const Uncapitalize = str => str.charAt(0).toLowerCase() + str.slice(1);

export interface Item {
  type: string;
  items?: any;
  relation?: {
    type: string;
    to: string;
    typename: string;
  };
}

export interface CustomizeResolver {
  Fields: {
    [fieldname: string]: {
      resolve: (rootValue) => Promise<any>;
      create: (payload: any, schema: Field) => Promise<any>;
      update: (payload: any, schema: Field) => Promise<any>;
    }
  };
}

interface Context {
  document: any;
  connectors: Record<string, Connector>;
}

export default class Resolver {
  private resolvers: {[key: string]: CustomizeResolver};
  private fieldMap: {[key: string]: Field};

  constructor({resolvers, schema}:
    {
      resolvers: {[key: string]: CustomizeResolver},
      schema: {[key: string]: Item}
    }) {
    this.resolvers = resolvers;
    this.fieldMap = createSchema(schema);
  }

  public listQueryById = (key, typename) => (obj, args, {document, connectors}: Context) => {
    return connectors[key].listResolveByUnique({
      key,
      field: args.where,
      document,
      schema: this.fieldMap[key]
    })
    .then(data => {
      // merge with customized resolvers
      if (this.resolvers && this.resolvers[key] && this.resolvers[key].Fields) {
        data = this.mergeWithCustomizeFieldResolvers(data, this.resolvers[key].Fields);
      }
      return {
        ...data,
        __typename: typename
      };
    });
  }

  public listQuery = (key, typename, connection = false) => (obj, args, {document, connectors}: Context) => {
    const pagination = this.argsToPagination(args);
    return connectors[key].listResolveQuery({
      key,
      where: args && args.where ? this.parseWhere(args.where, this.fieldMap[key]) : null,
      order: args && args.orderBy ? this.parseOrder(args.orderBy) : null,
      pagination,
      document,
      schema: this.fieldMap[key]
    })
    .then(async response => {
      const fieldResolvers = this.resolvers && this.resolvers[key] && this.resolvers[key].Fields;
      return this.parseConnection(response, connection, typename, fieldResolvers);
    });
  }

  public toOneResolver =
    ({from, to, key, typename}: {from: string, to: string, key: string, typename: string}) =>
    (obj, args, {connectors}: Context) => {
    const data = obj[key];
    // when query with toOne field, data will be inserted
    if (isPlainObject(data)) {
      return {
        ...data,
        __typename: typename
      };
    }

    return connectors[to].resolveToOne({from, to, id: data, schema: this.fieldMap[to]})
    .then(row => {
      if (this.resolvers && this.resolvers[key] && this.resolvers[key].Fields) {
        row = this.mergeWithCustomizeFieldResolvers(row, this.resolvers[to].Fields);
      }
      return {
        ...row,
        __typename: typename
      };
    });
  }

  public toManyResolver =
    ({
      from, to, key, typename, connection = false
    }: {
      from: string, to: string, key: string, typename: string, connection?: boolean
    }) => async (obj, args, {connectors}: Context) => {
    const pagination = this.argsToPagination(args);
    const fieldResolvers = this.resolvers && this.resolvers[to] && this.resolvers[to].Fields;
    return connectors[to].resolveToMany({
      from,
      to,
      ids: obj[key],
      pagination,
      schema: this.fieldMap[to]
    })
    .then(response => this.parseConnection(response, connection, typename, fieldResolvers));
  }

  public mapQuery = (key: string, typename: string) => (obj, args, {connectors}: Context) => {
    return connectors[key].mapResolve(key, this.fieldMap[key])
    .then(data => {
      if (this.resolvers && this.resolvers[key] && this.resolvers[key].Fields) {
        data = this.mergeWithCustomizeFieldResolvers(data, this.resolvers[key].Fields);
      }
      return {
        ...data,
        __typename: typename
      };
    });
  }

  public listCreateMutation = (key: string, typename: string) => async (obj, args, {connectors}: Context) => {
    // relation might have create and connect
    // nested array have three operations
    const field = this.fieldMap[key];
    const payload = args.data;
    const where = args.where;
    const normalFields = {
      __typename: typename
    };
    const fieldResolvers = {};
    forEach(payload, (value, fieldname) => {
      const fieldSchema = field.getChild(fieldname);
      if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToOne()) {
        fieldResolvers[fieldname] =
          new ToOneField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      } else if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToMany()) {
        fieldResolvers[fieldname] =
          new ToManyField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      } else {
        // normal field
        normalFields[fieldname] = value;
      }
    });

    // preResolve
    await Promise.all(
      values(fieldResolvers).map(
        (mutationField: MutationField<any>) => mutationField.preResolveCreate(connectors[key])));
    // resolve
    const resolvedValues = mapValues(fieldResolvers, (mutationField: MutationField<any>) => mutationField.resolve());
    let merged: any = {...normalFields, ...resolvedValues};
    if (this.resolvers && this.resolvers[key] && this.resolvers[key].Fields) {
      merged = this.mergeWithCustomizeCreate(merged, this.resolvers[key].Fields, field);
    }
    return connectors[key].listCreate(key, merged, field);
  }

  public listUpdateMutation = (key: string, typename: string) => async (obj, args, {connectors}: Context) => {
    // relation might have create and connect
    // nested array have three operations
    const field = this.fieldMap[key];
    const payload = args.data;
    const where = args.where;
    const normalFields = {
      __typename: typename
    };
    const fieldResolvers = {};
    forEach(payload, (value, fieldname) => {
      const fieldSchema = field.getChild(fieldname);
      if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToOne()) {
        fieldResolvers[fieldname] =
          new ToOneField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      } else if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToMany()) {
        fieldResolvers[fieldname] =
          new ToManyField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      } else {
        // normal field
        normalFields[fieldname] = value;
      }
    });

    // preResolve
    await Promise.all(
      values(fieldResolvers).map(
        (mutationField: MutationField<any>) => mutationField.preResolveUpdate(where.id, connectors[key])));
    // resolve
    const resolvedValues = mapValues(fieldResolvers, (mutationField: MutationField<any>) => mutationField.resolve());
    let merged: any = {...normalFields, ...resolvedValues};
    if (this.resolvers && this.resolvers[key] && this.resolvers[key].Fields) {
      merged = this.mergeWithCustomizeUpdate(merged, this.resolvers[key].Fields, field);
    }
    return connectors[key].listUpdate(key, where, merged, field);
  }

  public listDeleteMutation = (key: string, typename: string) => async (obj, args, {connectors}: Context) => {
    // relation might have create and connect
    // nested array have three operations
    const field = this.fieldMap[key];
    const payload = args.data;
    const where = args.where;
    const fieldResolvers = {};
    forEach(payload, (value, fieldname) => {
      const fieldSchema = field.getChild(fieldname);
      if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToOne()) {
        fieldResolvers[fieldname] =
          new ToOneField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      } else if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToMany()) {
        fieldResolvers[fieldname] =
          new ToManyField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      }
    });

    // preResolve
    await Promise.all(
      values(fieldResolvers).map(
        (mutationField: MutationField<any>) => mutationField.preResolveDelete(where.id, connectors[key])));

    return connectors[key].listDelete(key, where, field)
    .then(data => {
      return {
        ...data,
        __typename: typename
      };
    });
  }

  public mapUpdateMutation = (key: string, typename: string) => async (obj, args, {connectors}: Context) => {
    // relation might have create and connect
    // nested array have three operations
    const field = this.fieldMap[key];
    const payload = args.data;
    const normalFields = {
      __typename: typename
    };
    const fieldResolvers = {};
    forEach(payload, (value, fieldname) => {
      const fieldSchema = field.getChild(fieldname);
      if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToOne()) {
        fieldResolvers[fieldname] =
          new ToOneField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      } else if (fieldSchema.getType() === Types.RELATION && (fieldSchema as RelationField).isToMany()) {
        fieldResolvers[fieldname] =
          new ToManyField({
            rootSchema: field, collection: key, key: fieldname, itemSchema: fieldSchema, payload: value});
      } else {
        // normal field
        normalFields[fieldname] = value;
      }
    });

    // preResolve
    await Promise.all(
      values(fieldResolvers).map(
        (mutationField: MutationField<any>) => mutationField.preResolveMapUpdate(connectors[key])));
    // resolve
    const resolvedValues = mapValues(fieldResolvers, (mutationField: MutationField<any>) => mutationField.resolve());
    let merged: any = {...normalFields, ...resolvedValues};
    if (this.resolvers && this.resolvers[key] && this.resolvers[key].Fields) {
      merged = this.mergeWithCustomizeFieldResolvers(merged, this.resolvers[key].Fields);
    }
    return connectors[key].mapUpdate(key, merged, field);
  }

  public typeResolver(field: Field, modelKey: string) {
    const fieldResolvers = {};
    field.forEach((subfield: Field) => {
      const key = subfield.getKey();
      if (subfield.getType() === Types.RELATION && (subfield as RelationField).isToOne()) {
        // relation: {type, to, typename}
        fieldResolvers[key] = this.toOneResolver({
          from: modelKey,
          to: (subfield as RelationField).relationTo(),
          key,
          typename: (subfield as RelationField).getTypename()
        });
      } else if (subfield.getType() === Types.RELATION && (subfield as RelationField).isToMany()) {
        // normal & connection
        fieldResolvers[key] = this.toManyResolver({
          from: modelKey,
          to: (subfield as RelationField).relationTo(),
          key,
          typename: (subfield as RelationField).getTypename()
        });

        fieldResolvers[`${key}Connection`] = this.toManyResolver({
          from: modelKey,
          to: (subfield as RelationField).relationTo(),
          key,
          typename: (subfield as RelationField).getTypename(),
          connection: true
        });
      } else if (subfield.getType() === Types.ARRAY && subfield.hasChild()) {
        // nested array, normal & connection
        fieldResolvers[key] = (obj, args) => {
          const pagination = this.argsToPagination(args);
          return paginator(obj[key], pagination)
          .then(response => response.edges.map(o => o.node));
        };

        fieldResolvers[`${key}Connection`] = (obj, args) => {
          if (obj[`${key}Connection`]) {
            return obj[`${key}Connection`];
          }
          const pagination = this.argsToPagination(args);
          return paginator(obj[key], pagination);
        };
      } else if (subfield.getType() === Types.ARRAY && !subfield.hasChild()) {
        fieldResolvers[key] = obj => isEmpty(obj[key]) ? [] : obj[key];
      } else if (subfield.getType() === Types.OBJECT) {
        // return empty object, if empty
        fieldResolvers[key] = obj => isEmpty(obj[key]) ? {} : obj[key];
      } else {
        // default resolver
        // for nestedObject, nested array, scalar type
        fieldResolvers[key] = obj => isUndefined(obj[key]) ? null : obj[key];
      }
    });
    return fieldResolvers;
  }

  public types() {
    const retQuery = {};
    forEach(this.fieldMap, (field, key) => {
      const singularKey = pluralize.singular(key);
      const pluralKey = pluralize.plural(key);

      // add fields & fieldsConnection
      const type = field.getType();
      if (type === Types.ARRAY) {
        // add __typename resolver
        const capitalSingularKey = capitalizeFirstLetter(singularKey);
        retQuery[capitalSingularKey] = this.typeResolver(field, key);
      }

      if (type === Types.OBJECT) {
        const typename = `${capitalizeFirstLetter(singularKey)}Payload`;
        retQuery[typename] = this.typeResolver(field, key);
      }
    });

    return retQuery;
  }

  public query() {
    const retQuery = {};
    forEach(this.fieldMap, (field, key) => {
      const uncapKey = Uncapitalize(key);
      const singularKey = pluralize.singular(uncapKey);
      const pluralKey = pluralize.plural(uncapKey);

      const type = field.getType();
      // add fields & fieldsConnection
      if (type === Types.ARRAY) {
        const capitalSingularKey = capitalizeFirstLetter(singularKey);

        // query by id
        retQuery[singularKey] = this.listQueryById(key, capitalSingularKey);

        // query
        retQuery[pluralKey] = this.listQuery(key, capitalSingularKey);
        // connection
        retQuery[`${pluralKey}Connection`] = this.listQuery(key, capitalSingularKey, true);
      }

      if (type === Types.OBJECT) {
        const typename = `${capitalizeFirstLetter(singularKey)}Payload`;
        retQuery[key] = this.mapQuery(key, typename);
      }
    });

    return retQuery;
  }

  public mutation() {
    const retMutations = {};
    forEach(this.fieldMap, (field, key) => {
      const singularKey = pluralize.singular(key);
      const pluralKey = pluralize.plural(key);

      const type = field.getType();
      // add fields & fieldsConnection
      if (type === Types.ARRAY) {
        const capitalSingularKey = capitalizeFirstLetter(singularKey);
        retMutations[`create${capitalSingularKey}`] = this.listCreateMutation(key, capitalSingularKey);
        retMutations[`update${capitalSingularKey}`] = this.listUpdateMutation(key, capitalSingularKey);
        retMutations[`delete${capitalSingularKey}`] = this.listDeleteMutation(key, capitalSingularKey);
      }

      if (type === Types.OBJECT) {
        const capitalSingularKey = capitalizeFirstLetter(singularKey);
        const typename = `${capitalSingularKey}Payload`;
        retMutations[`update${capitalSingularKey}`] = this.mapUpdateMutation(key, typename);
      }
    });
    return retMutations;
  }

  private parseWhere(where, field?: Field) {
    const ret = {};
    // where: {id: "1", age_gt: 10, author: {name: {age_gt}}}
    // -> {id: {schema, op: {eq: 1}}, age: {schema, op: {gt: 10}}, author: {schema, op: {name: {op: {gt}}, age}}}
    Object.keys(where).forEach(operator => {
      const value = where[operator];
      // nested where
      if (isPlainObject(value)) {
        const fieldName = operator;
        ret[fieldName] = {op: this.parseWhere(value)};
        if (field && field.getChild(fieldName).exists()) {
          ret[fieldName].schema = field.getChild(fieldName);
        }
      } else {
        const operatorSplit = operator.split('_');
        // eq without operator
        let fieldName;
        let operatorName;
        if (operatorSplit.length === 1) {
          fieldName = operator;
          operatorName = 'eq';
        } else {
          fieldName = operatorSplit.slice(0, -1).join('_');
          operatorName = last(operatorSplit);
        }
        if (!ret[fieldName]) {
          ret[fieldName] = {op: {}};
        }

        if (field && field.getChild(fieldName).exists()) {
          ret[fieldName].schema = field.getChild(fieldName);
        }
        ret[fieldName].op[operatorName] = value;
      }
    });
    return ret;
  }

  private parseOrder(order) {
    const orderSplit = order.split('_');
    const fieldName = orderSplit.slice(0, -1).join('_');
    const orderOperator = last(orderSplit) as string;
    return {
      key: fieldName,
      value: orderOperator.toLowerCase() === 'asc' ? 1 : -1
    };
  }

  private parseConnection(response, connection, typename, fieldResolvers) {
    if (connection) {
      const rows = response.edges;
      return {
        ...response,
        edges: rows.map(row => {
          const data = (!isEmpty(fieldResolvers))
            ? row.node
            : this.mergeWithCustomizeFieldResolvers(row.node, fieldResolvers);

          return {
            cursor: row.cursor,
            node: {
              ...data,
              __typename: typename
            }
          };
        })
      };
    }
    return response.edges.map(edge => {
      const data = (!isEmpty(fieldResolvers))
        ? edge.node
        : this.mergeWithCustomizeFieldResolvers(edge.node, fieldResolvers);
      return {
        ...data,
        __typename: typename
      };
    });
  }

  private mergeWithCustomizeFieldResolvers(data: any, fieldResolvers: any) {
    return pickBy({
      ...data,
      ...mapValues(fieldResolvers, (resolver, key) => {
        const resolve = resolver.resolve;
        if (!resolve) {
          return undefined;
        }
        return resolve(data);
      })
    }, val => !isUndefined(val));
  }

  private mergeWithCustomizeCreate(payload: any, fieldResolvers: any, schema: Field) {
    return pickBy({
      ...payload,
      ...mapValues(fieldResolvers, (resolver, key) => {
        const resolve = resolver.create;
        if (!resolve) {
          return undefined;
        }
        return resolve(payload, schema);
      })
    }, val => !isUndefined(val));
  }

  private mergeWithCustomizeUpdate(payload: any, fieldResolvers: any, schema: Field) {
    return pickBy({
      ...payload,
      ...mapValues(fieldResolvers, (resolver, key) => {
        const resolve = resolver.update;
        if (!resolve) {
          return undefined;
        }
        return resolve(payload, schema);
      })
    }, val => !isUndefined(val));
  }

  private argsToPagination(args: any) {
    return isEmpty(args)
      ? null
      : pick(args, ['first', 'last', 'before', 'after']);
  }
}
