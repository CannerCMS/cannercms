// @flow

import React, {useState, useEffect, useContext, useRef} from 'react';
import {Context} from 'canner-helpers';
const AddButton = () => null;
const Generator = () => null;
const Toolbar = () => null;

export default function ListForm({
  getListValue,
  goTo,
  routes,
  subscribeListValue
}: {
  goTo: Function,
  routes: Function,
  getListValue: Function,
  subscribeListValue: Function
}) {
  const {rootValue, setRootValue} = useState({});
  const {data, setData} = useState({});
  const {isFetching, setIsFetching} = useState(true);
  const unsubscribeRef = useRef(function() {});
  const updateValue = (result) => {
    setData(result.data);
    setRootValue(result.rootValue);
    setIsFetching(false);
  };
  useEffect(() => {
    getListValue().then(result => {
      updateValue(result);
      const {unsubscribe} = subscribeListValue();
      return unsubscribeRef.current = unsubscribe;
    });
    return unsubscribeRef.current;
  }, []);
  const clickAddButton = () => {
    goTo({
      pathname: `${routes[0]}`,
      operator: {
        operator: 'create'
      }
    });
  }
  return (
    <Context.Provider
      value={{
        rootValue,
        data
      }}
    >
      <AddButton onClick={clickAddButton}/>
      <Toolbar />
      {isFetching ? null : (<Generator/>)}
    </Context.Provider>
  )
}