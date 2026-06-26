import { RootState } from '../store';

export const getIngredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;
export const getIngredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isLoading;
export const getIngredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;
export const getIngredientByIdSelector = (id: string) => (state: RootState) =>
  state.ingredients.ingredients.find((ingredient) => ingredient._id === id);
