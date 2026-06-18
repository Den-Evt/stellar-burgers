import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        // Булка заменяется
        state.constructorItems.bun = ingredient;
      } else {
        // Начинки и соусы добавляются в массив
        state.constructorItems.ingredients.push({
          ...ingredient,
          id: `${ingredient._id}_${Date.now()}`
        });
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index > 0) {
        const items = state.constructorItems.ingredients;
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        const items = state.constructorItems.ingredients;
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
      }
    },
    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
