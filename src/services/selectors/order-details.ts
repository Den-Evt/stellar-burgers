import { RootState } from '../store';

export const getOrderDataSelector = (state: RootState) =>
  state.orderDetails.orderData;
export const getOrderDetailsLoadingSelector = (state: RootState) =>
  state.orderDetails.isLoading;
export const getOrderDetailsErrorSelector = (state: RootState) =>
  state.orderDetails.error;
