import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
  });

  test('должен добавлять ингредиент из списка в конструктор', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    const addButton = ingredientCard.locator(
      'button:has-text("Добавить")'
    );
    await addButton.click();

    const constructorSection = page.locator(
      'section:has(button:has-text("Оформить заказ"))'
    );
    const addedIngredient = constructorSection.locator(
      'text=Биокотлета из марсианской Магнолии'
    );
    await expect(addedIngredient).toBeVisible();
  });

  test('должен добавлять булку в конструктор', async ({ page }) => {
    await page.goto('/');

    const bunCard = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const addButton = bunCard.locator('button:has-text("Добавить")');
    await addButton.click();

    const constructorSection = page.locator(
      'section:has(button:has-text("Оформить заказ"))'
    );
    
    const bunTop = constructorSection.locator(
      'text=Краторная булка N-200i (верх)'
    );
    await expect(bunTop).toBeVisible();

    const bunBottom = constructorSection.locator(
      'text=Краторная булка N-200i (низ)'
    );
    await expect(bunBottom).toBeVisible();
  });

  test('должен открывать модальное окно ингредиента при клике', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Краторная булка N-200i'
    });
    await ingredientLink.click();

    // Используем контейнер #modals для модалок
    const modalContainer = page.locator('#modals');
    await expect(modalContainer).not.toBeEmpty();

    const modalTitle = modalContainer.locator(
      'h3:has-text("Детали ингредиента")'
    );
    await expect(modalTitle).toBeVisible();
  });

  test('должен отображать данные конкретного ингредиента в модалке', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    await ingredientLink.click();

    const modalContainer = page.locator('#modals');
    await expect(modalContainer).not.toBeEmpty();

    const modalTitle = modalContainer.locator(
      'h3:has-text("Биокотлета из марсианской Магнолии")'
    );
    await expect(modalTitle).toBeVisible();

    await expect(
      modalContainer.locator('text=Калории, ккал')
    ).toBeVisible();
    await expect(modalContainer.locator('text=Белки, г')).toBeVisible();
    await expect(modalContainer.locator('text=Жиры, г')).toBeVisible();
    await expect(
      modalContainer.locator('text=Углеводы, г')
    ).toBeVisible();
  });

  test('должен закрывать модальное окно по клику на крестик', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Краторная булка N-200i'
    });
    await ingredientLink.click();

    const modalContainer = page.locator('#modals');
    await expect(modalContainer).not.toBeEmpty();

    const modalTitle = modalContainer.locator(
      'h3:has-text("Детали ингредиента")'
    );
    await expect(modalTitle).toBeVisible();

    // Ищем кнопку закрытия внутри модалки
    const closeButton = modalContainer.locator('button').first();
    await closeButton.click();

    await expect(modalTitle).not.toBeVisible();
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Краторная булка N-200i'
    });
    await ingredientLink.click();

    const modalContainer = page.locator('#modals');
    await expect(modalContainer).not.toBeEmpty();

    const modalTitle = modalContainer.locator(
      'h3:has-text("Детали ингредиента")'
    );
    await expect(modalTitle).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(modalTitle).not.toBeVisible();
  });

  test('должен создавать заказ', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      update: false
    });

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Булки' })).toBeVisible();

    const bunCard = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const bunButton = bunCard.locator('button:has-text("Добавить")');
    await bunButton.click();

    const ingredientCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    const ingredientButton = ingredientCard.locator(
      'button:has-text("Добавить")'
    );
    await ingredientButton.click();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    const modalContainer = page.locator('#modals');
    await expect(modalContainer).not.toBeEmpty({ timeout: 10000 });

    const orderModalText = modalContainer.locator(
      'text=Ваш заказ начали готовить'
    );
    await expect(orderModalText).toBeVisible();

    const orderNumber = modalContainer.locator('h2');
    await expect(orderNumber).toBeVisible();
    await expect(orderNumber).toHaveText('8103');

    const closeButton = modalContainer.locator('button').first();
    await closeButton.click();

    await expect(orderModalText).not.toBeVisible();

    const constructorSection = page.locator(
      'section:has(button:has-text("Оформить заказ"))'
    );
    await expect(
      constructorSection.locator('text=Выберите булки').first()
    ).toBeVisible();

    await expect(
      constructorSection.locator('text=Выберите начинку')
    ).toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
  });
});