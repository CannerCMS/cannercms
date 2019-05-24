// @flow
import { useState, useEffect, useCallback } from 'react';
import { createEmptyData } from 'canner-helpers';

export default function useCreateForm({
  provider,
  schema,
  routes,
  isCreateForm,
}: {
  provider: Object,
  schema: Object,
  routes: Array<string>,
  isCreateForm: boolean
}) {
  const [result, setResult] = useState({ data: {}, rootValue: {} });
  const [isFetching, setIsFetching] = useState(true);
  const key = routes[0];
  const createItem = async () => {
    const { items } = schema[key];
    const defaultData = createEmptyData(items);
    const id = randomId();
    const action = {
      type: 'CREATE_ARRAY',
      payload: {
        key,
        id,
        value: defaultData,
        path: '',
      },
    };
    await provider.updateQuery([key], { where: { id } });
    return provider.request(action);
  };
  const subscribeValue = () => provider.subscribe(routes[0], (result) => {
    setResult(result);
  });
  useEffect(() => {
    if (!isCreateForm) {
      return;
    }
    setIsFetching(true);
    createItem()
      .then(() => {
        setIsFetching(false);
      });
    const { unsubscribe } = subscribeValue();
    return unsubscribe;
  }, [isCreateForm, JSON.stringify(routes)]);
  const onClickSubmitButton = useCallback(() => {}, []);
  const onClickCancelButton = useCallback(() => {}, []);
  const onClickBackButton = useCallback(() => {}, []);
  return {
    data: result.data,
    rootValue: result.rootValue,
    isFetching,
    toolbar: (schema[routes[0]] || {}).toolbar,
    onClickSubmitButton,
    onClickCancelButton,
    onClickBackButton,
    ...provider,
  };
}
function randomId() {
  return Math.random().toString(36).substr(2, 12);
}
