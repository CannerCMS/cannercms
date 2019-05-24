// @flow
import { useState, useEffect } from 'react';
import { genCacheTree } from '../utils/componentTree';

export default function useTree({
  componentTree,
}: any) {
  const [tree, setTree] = useState(() => genCacheTree(componentTree));
  useEffect(() => {
    setTree(genCacheTree(componentTree));
  }, [componentTree]);
  return tree;
}
