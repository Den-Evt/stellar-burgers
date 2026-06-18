import { RootState } from '../store';

export const getProfileOrdersSelector = (state: RootState) =>
  state.profileOrders.orders;
export const getProfileOrdersLoadingSelector = (state: RootState) =>
  state.profileOrders.isLoading;
export const getProfileOrdersErrorSelector = (state: RootState) =>
  state.profileOrders.error;
