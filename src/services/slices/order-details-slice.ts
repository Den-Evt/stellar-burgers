import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderDetailsState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | undefined;
};

const initialState: TOrderDetailsState = {
  orderData: null,
  isLoading: false,
  error: undefined
};

export const getOrderInfo = createAsyncThunk(
  'orderDetails/getOrderInfo',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.orders && response.orders.length > 0) {
      return response.orders[0];
    }
    throw new Error('Заказ не найден');
  }
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
      state.isLoading = false;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderInfo.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        getOrderInfo.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(getOrderInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearOrderData } = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;
