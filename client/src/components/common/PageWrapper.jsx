import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { setAppState } from '../../redux/slices/appStateSlice';
const PageWrapper = ({state, children}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(setAppState)
    }, [state])
  return (
    children
  );
}

export default PageWrapper