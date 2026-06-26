import { RootState } from '../store';

export const getUserSelector = (state: RootState) => state.user.user;
export const getIsAuthenticatedSelector = (state: RootState) =>
  state.user.isAuthenticated;
export const getUserLoadingSelector = (state: RootState) =>
  state.user.isLoading;
export const getIsAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;
export const getUserErrorSelector = (state: RootState) => state.user.error;
