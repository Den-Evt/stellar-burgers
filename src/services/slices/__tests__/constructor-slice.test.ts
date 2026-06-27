import { describe, expect, test } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructor-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('Constructor Reducer', () => {
  const mockBun: TIngredient = {
    _id: 'bun1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'bun.png',
    image_mobile: 'bun_mobile.png',
    image_large: 'bun_large.png'
  };

  const mockIngredient1: TIngredient = {
    _id: 'ing1',
    name: 'Начинка 1',
    type: 'main',
    proteins: 15,
    fat: 8,
    carbohydrates: 25,
    calories: 150,
    price: 80,
    image: 'ing1.png',
    image_mobile: 'ing1_mobile.png',
    image_large: 'ing1_large.png'
  };

  const mockIngredient2: TIngredient = {
    _id: 'ing2',
    name: 'Начинка 2',
    type: 'main',
    proteins: 12,
    fat: 6,
    carbohydrates: 22,
    calories: 130,
    price: 70,
    image: 'ing2.png',
    image_mobile: 'ing2_mobile.png',
    image_large: 'ing2_large.png'
  };

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      }
    });
  });

  test('должен добавлять булку', () => {
    const initialState = constructorReducer(undefined, { type: 'INIT' });
    const action = addIngredient(mockBun);
    const state = constructorReducer(initialState, action);

    expect(state.constructorItems.bun).not.toBeNull();
    expect(state.constructorItems.bun?._id).toBe('bun1');
  });

  test('должен добавлять начинку', () => {
    const initialState = constructorReducer(undefined, { type: 'INIT' });
    const action = addIngredient(mockIngredient1);
    const state = constructorReducer(initialState, action);

    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]._id).toBe('ing1');
  });

  test('должен удалять ингредиент', () => {
    const ingredientWithId: TConstructorIngredient = {
      ...mockIngredient1,
      id: 'ing1_123'
    };
    const initialState = constructorReducer(undefined, { type: 'INIT' });
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );

    const action = removeIngredient(
      stateWithIngredient.constructorItems.ingredients[0].id
    );
    const state = constructorReducer(stateWithIngredient, action);

    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  test('должен перемещать ингредиент вверх', () => {
    const initialState = constructorReducer(undefined, { type: 'INIT' });
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));

    const secondIngredientId = state.constructorItems.ingredients[1].id;
    const action = moveIngredientUp(secondIngredientId);
    state = constructorReducer(state, action);

    expect(state.constructorItems.ingredients[0]._id).toBe('ing2');
    expect(state.constructorItems.ingredients[1]._id).toBe('ing1');
  });

  test('должен перемещать ингредиент вниз', () => {
    const initialState = constructorReducer(undefined, { type: 'INIT' });
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));

    const firstIngredientId = state.constructorItems.ingredients[0].id;
    const action = moveIngredientDown(firstIngredientId);
    state = constructorReducer(state, action);

    expect(state.constructorItems.ingredients[0]._id).toBe('ing2');
    expect(state.constructorItems.ingredients[1]._id).toBe('ing1');
  });

  test('должен очищать конструктор', () => {
    const initialState = constructorReducer(undefined, { type: 'INIT' });
    let state = constructorReducer(initialState, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient1));

    const action = clearConstructor();
    state = constructorReducer(state, action);

    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });
});
