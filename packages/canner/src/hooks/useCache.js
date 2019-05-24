// @flow

import { useRef } from 'react';
// $FlowFixMe cache type
import Cache from '@canner/cache';
import { mutate } from '../action';
import { parseConnectionToNormal } from '../hocs/utils';

export default function useCache(defaultData: any) {
  const cacheRef = useRef(new Cache({
    reducer: (cachedData, action) => {
      const mutatedData = mutate(cachedData.data, action);
      return {
        data: mutatedData,
        rootValue: parseConnectionToNormal(mutatedData),
      };
    },
    defaultData,
  }));
  return cacheRef.current;
}
