import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients-slice';
import constructorReducer from './slices/constructor-slice';
import ordersReducer from './slices/orders-slice';
import feedReducer from './slices/feed-slice';
import orderDetailsReducer from './slices/order-details-slice';
import userReducer from './slices/user-slice';
import profileOrdersReducer from './slices/profile-orders-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  feed: feedReducer,
  orderDetails: orderDetailsReducer,
  user: userReducer,
  profileOrders: profileOrdersReducer
});
