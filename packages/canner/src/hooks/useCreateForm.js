// @flow
import {useState, useEffect} from 'react';

export default function useCreateForm({
  provider,
  schema,
  routes,
  isCreateForm
}: {
  provider: Object,
  schema: Object,
  routes: Array<string>,
  isCreateForm: boolean
}) {
  const [result, setResult] = useState({data: {}, rootValue: {}});
  const [isFetching, setIsFetching] = useState(true);
  const getCreateValue = () => provider.create(routes[0]);
  const subscribeValue = () => provider.subscribe(routes[0], (result) => {
    setResult(result);
  });
  useEffect(() => {
    if (!isCreateForm) {
      return;
    }
    getCreateValue()
      .then(result => {
        setResult(result);
        setIsFetching(false);
      });
    const {unsubscribe} = subscribeValue();
    return unsubscribe;
  }, [isCreateForm, JSON.stringify(routes)])
  return {
    data: result.data,
    rootValue: result.rootValue,
    isFetching,
    toolbar: (schema[routes[0]] || {}).toolbar,
    onClickSubmitButton: () => {},
    onClickCancelButton: () => {},
    onClickBackButton: () => {},
    ...provider
  }
}
