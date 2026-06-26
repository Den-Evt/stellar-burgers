import { RootState } from '../store';

export const getOrderRequestSelector = (state: RootState) =>
  state.orders.orderRequest;
export const getOrderModalDataSelector = (state: RootState) =>
  state.orders.orderModalData;
