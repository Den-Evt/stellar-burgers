import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test('должен добавлять ингредиент из списка в конструктор', async ({
    page
  }) => {
    // Перехватываем запрос ингредиентов
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    // Находим карточку ингредиента и нажимаем "Добавить"
    const ingredientCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    const addButton = ingredientCard.locator(
      'button:has-text("Добавить")'
    );
    await addButton.click();

    // Проверяем, что ингредиент появился в конструкторе
    const constructorElement = page.locator(
      'text=Биокотлета из марсианской Магнолии'
    ).nth(1);
    await expect(constructorElement).toBeVisible();
  });

  test('должен добавлять булку в конструктор', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    const bunCard = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const addButton = bunCard.locator('button:has-text("Добавить")');
    await addButton.click();

    const bunTop = page.locator('text=(верх)');
    const bunBottom = page.locator('text=(низ)');
    await expect(bunTop).toBeVisible();
    await expect(bunBottom).toBeVisible();
  });

  test('должен открывать модальное окно ингредиента при клике', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Краторная булка N-200i'
    });
    await ingredientLink.click();

    const modalTitle = page.locator('h3:has-text("Детали ингредиента")');
    await expect(modalTitle).toBeVisible();
  });

  test('должен отображать данные конкретного ингредиента в модалке', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    await ingredientLink.click();

    const modalTitle = page.locator(
      'h3:has-text("Биокотлета из марсианской Магнолии")'
    );
    await expect(modalTitle).toBeVisible();

    await expect(page.locator('text=Калории, ккал')).toBeVisible();
    await expect(page.locator('text=Белки, г')).toBeVisible();
  });

  test('должен закрывать модальное окно по клику на крестик', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Краторная булка N-200i'
    });
    await ingredientLink.click();

    const modalTitle = page.locator('h3:has-text("Детали ингредиента")');
    await expect(modalTitle).toBeVisible();

    const closeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).first();
    await closeButton.click({ force: true });

    await expect(modalTitle).not.toBeVisible();
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    const ingredientLink = page.locator('a', {
      hasText: 'Краторная булка N-200i'
    });
    await ingredientLink.click();

    const modalTitle = page.locator('h3:has-text("Детали ингредиента")');
    await expect(modalTitle).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(modalTitle).not.toBeVisible();
  });

  test('должен создавать заказ', async ({ page, context }) => {
    // Подставляем фейковые токены ПЕРЕД открытием страницы
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

    // Перехватываем ВСЕ запросы перед загрузкой страницы
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      update: false
    });

    // Загружаем страницу ОДИН раз
    await page.goto('/');

    // Ждём загрузки ингредиентов
    await expect(page.getByRole('heading', { name: 'Булки' })).toBeVisible();

    // Добавляем булку
    const bunCard = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const bunButton = bunCard.locator('button:has-text("Добавить")');
    await bunButton.click();

    // Добавляем начинку
    const ingredientCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    const ingredientButton = ingredientCard.locator(
      'button:has-text("Добавить")'
    );
    await ingredientButton.click();

    // Кликаем по кнопке "Оформить заказ"
    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    // Проверяем, что модалка с заказом открылась
    const orderModalText = page.locator(
      'text=Ваш заказ начали готовить'
    );
    await expect(orderModalText).toBeVisible({ timeout: 10000 });

    // Проверяем, что номер заказа отображается
    const orderNumber = page.locator('h2').filter({
      hasText: /^\d+$/
    });
    await expect(orderNumber).toBeVisible();

    // Закрываем модалку
    const closeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).first();
    await closeButton.click({ force: true });

    // Проверяем, что модалка закрылась
    await expect(orderModalText).not.toBeVisible();

    // Проверяем, что конструктор пуст
    await expect(page.locator('text=Выберите булки').first()).toBeVisible();

    // Очищаем токены после теста
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
  });
});