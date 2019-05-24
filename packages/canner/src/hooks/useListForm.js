// @flow
import {
  useState, useEffect, useCallback, useMemo,
} from 'react';

export default function useListForm({
  provider,
  schema,
  routes,
  isListForm,
}: {
  provider: Object,
  schema: Object,
  routes: Array<string>,
  isListForm: boolean
}) {
  const [result, setResult] = useState({ data: {}, rootValue: {} });
  const [isFetching, setIsFetching] = useState(true);
  const key = routes[0];
  const getArgs = () => {
    if (isListForm) {
      return provider.query.getArgs(key);
    }
    return {};
  };
  const getListValue = () => provider.fetch(key);
  const subscribeListValue = () => provider.subscribe(key, (result) => {
    setResult(result);
  });
  useEffect(() => {
    if (!isListForm) {
      return;
    }
    setIsFetching(true);
    getListValue()
      .then((result) => {
        setResult(result);
        setIsFetching(false);
      });

    const { unsubscribe } = subscribeListValue();
    return unsubscribe;
  }, [isListForm, key]);
  const args = useMemo(getArgs, [key, isListForm]);
  const onClickAddButton = useCallback(() => {}, []);
  return {
    data: result.data,
    rootValue: result.rootValue,
    isFetching,
    toolbar: (schema[routes[0]] || {}).toolbar,
    items: (schema[routes[0]] || {}).items,
    args,
    onClickAddButton,
    ...provider,
  };
}
