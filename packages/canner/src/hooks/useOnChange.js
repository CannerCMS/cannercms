// @flow
import { useContext } from 'react';
import { isArray } from 'lodash';
import { Context } from 'canner-helpers';
import RefId from 'canner-ref-id';
import { createAction } from '../utils/action';
import { findSchemaByRefId } from '../utils/schema';

type changeQueue = Array<{RefId: RefId | {firstRefId: RefId, secondRefId: RefId}, type: any, value: any}>;

export default ({
  rootValue,
  request,
}: {
  rootValue: any,
  request: Function
}) => {
  const { schema } = useContext(Context);
  const onChange = (refId: RefId | {firstRefId: RefId, secondRefId: RefId} | changeQueue, type: any, delta: any, config: any, transformGqlPayload?: Function): Promise<*> => {
    let id;
    if (isArray(refId)) { // changeQueue
      const changeQueue = refId;
      // $FlowFixMe
      return Promise.all(changeQueue.map((args) => {
        const {
          refId, type, value, config, transformGqlPayload,
        } = args;
        return onChange(refId, type, value, config, transformGqlPayload);
      }));
    } if (refId instanceof RefId) {
      id = refId.toString();
    } else {
      id = {
        firstId: (refId: any).firstRefId.toString(),
        secondId: (refId: any).secondRefId.toString(),
      };
    }
    const itemSchema = findSchemaByRefId(schema, refId);
    const { relation, items, pattern } = itemSchema;
    const action = createAction({
      relation,
      id,
      type,
      value: delta,
      config,
      rootValue: { ...rootValue },
      items,
      pattern,
      transformGqlPayload,
    });
    if (!action) {
      throw new Error('invalid change');
    }
    if (action.type === 'NOOP') {
      return Promise.resolve();
    }
    return request(action);
  };
  return {
    onChange,
  };
};
