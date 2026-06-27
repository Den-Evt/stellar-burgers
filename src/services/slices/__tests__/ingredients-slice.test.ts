import { describe, expect, test } from '@jest/globals';
import ingredientsReducer, { getIngredients } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

describe('Ingredients Reducer', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: 'image1.png',
      image_mobile: 'image1_mobile.png',
      image_large: 'image1_large.png'
    },
    {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      proteins: 15,
      fat: 8,
      carbohydrates: 25,
      calories: 150,
      price: 80,
      image: 'image2.png',
      image_mobile: 'image2_mobile.png',
      image_large: 'image2_large.png'
    }
  ];

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: undefined
    });
  });

  test('должен обрабатывать getIngredients.pending', () => {
    const state = ingredientsReducer(undefined, {
      type: getIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('должен обрабатывать getIngredients.fulfilled', () => {
    const initialState = ingredientsReducer(undefined, { type: 'INIT' });
    const loadingState = ingredientsReducer(initialState, {
      type: getIngredients.pending.type
    });

    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(loadingState, action);

    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
  });

  test('должен обрабатывать getIngredients.rejected', () => {
    const initialState = ingredientsReducer(undefined, { type: 'INIT' });
    const loadingState = ingredientsReducer(initialState, {
      type: getIngredients.pending.type
    });

    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = ingredientsReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
