//@flow

import {useRef} from 'react';
import Cache from '@canner/cache';
import {mutate} from '../action';
import { parseConnectionToNormal } from '../hocs/utils';

export default () => {
  const cacheRef = useRef(new Cache({
    reducer: (cachedData, action) => {
      const mutatedData = mutate(cachedData.data, action);
      return {
        data: mutatedData,
        rootValue: parseConnectionToNormal(mutatedData)
      }
    }
  }));
  return cacheRef.current;
}