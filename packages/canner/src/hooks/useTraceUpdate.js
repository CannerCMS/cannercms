import { useRef, useEffect } from 'react';

export default function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      const rtn = ps;
      if (prev.current[k] !== v) {
        rtn[k] = [prev.current[k], v];
      }
      return rtn;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      // eslint-disable-next-line no-console
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}
