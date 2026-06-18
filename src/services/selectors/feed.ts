import { RootState } from '../store';

export const getFeedOrdersSelector = (state: RootState) => state.feed.orders;
export const getFeedTotalSelector = (state: RootState) => state.feed.total;
export const getFeedTotalTodaySelector = (state: RootState) =>
  state.feed.totalToday;
export const getFeedLoadingSelector = (state: RootState) =>
  state.feed.isLoading;
export const getFeedErrorSelector = (state: RootState) => state.feed.error;
