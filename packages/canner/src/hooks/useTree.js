// @flow
import {useState, useEffect, useDebugValue} from 'react';
import {genCacheTree} from '../utils/componentTree';

export default function useTree({
  componentTree
}: any) {
  const [tree, setTree] = useState(() => genCacheTree(componentTree));
  useEffect(() => {
    setTree(genCacheTree(componentTree));
  }, [componentTree]);
  console.log(tree);
  return tree
}
