import { useDispatch, useSelector } from "react-redux";
import { useEffect} from 'react';
import {setAuthModalOpen} from "../../redux/slices/authModalSlice";
const BlockPage = ({children}) => {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.user);
    useEffect(() => {
        dispatch(setAuthModalOpen(!user));
      }, [user, dispatch]);
  return (
    user ? children: null
  );
};

export default BlockPage;