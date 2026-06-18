import { RootState } from '../store';

export const getConstructorSelector = (state: RootState) =>
  state.burgerConstructor.constructorItems;
export const getBunSelector = (state: RootState) =>
  state.burgerConstructor.constructorItems.bun;
export const getIngredientsSelector = (state: RootState) =>
  state.burgerConstructor.constructorItems.ingredients;
