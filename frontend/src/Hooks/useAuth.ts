import { AppDispatch } from './../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { getLoginToken } from '../features/userSlice';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  dispatch(getLoginToken())
  const isAuthenticated = useSelector((state: RootState) => state.user.loggedIn);

  return isAuthenticated;
};

export default useAuth;