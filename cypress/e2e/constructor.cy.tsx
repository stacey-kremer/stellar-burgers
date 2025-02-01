import { URL } from '../../src/utils/burger-api';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

describe('Тест конструктора бургеров', () => {
  // Запуск перед каждым тестом
  beforeEach(() => {
    // Устанавливаю токен доступа в cookie
    setCookie(
      'accessToken',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjBhMDAyOTdlZGUwMDAxZDA2MDg1NCIsImlhdCI6MTcxMjMxMDE2NiwiZXhwIjoxNzEyMzExMzY2fQ.v7kdecJvLfdmlBsvf_BySvsfnXX3K0Er__GNYw-NRLM'
    );
    // Устанавливаю refresh token в localStorage
    localStorage.setItem(
      'refreshToken',
      '9cbdd5b777edfb92bd9183a7cf2372a12b545c045a9796f94c1afd0b9d374a8794aa15bee20a7556'
    );
    // Мокаю запросы к API (авторизация и ингредиенты)
    cy.intercept('GET', `${URL}//auth/user`, { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('GET', `${URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    // Открываю главную страницу приложения
    cy.visit('http://localhost:4000/');
    // Ожидаю ответа на запрос о пользователе
    cy.wait('@getUser');
  });

  // Завершаю после каждого теста
  afterEach(() => {
    // Удаляю токены после выполнения тестов
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Тест получения списка ингредиентов с сервера', () => {
    // Присваиваю элементам на странице alias для дальнейшего обращения
    cy.get('[data-cy="constructor"]').as('constructor');

    // Добавляю булочку и начинку через собственный командный хелпер
    cy.addItem('Булки');
    cy.addItem('Начинки');

    // Проверяю, что ингредиенты присутствуют в конструкторе
    cy.get('@constructor').should('contain', 'Краторная булка N-200i');
    cy.get('@constructor').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Тест открытия и закрытия модального окна ингредиента', () => {
    // Кликаю по первому элементу ингредиента
    cy.get('[data-cy="ingredient-item"]').first().click();

    // Ожидаю появления модального окна
    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').should('contain', 'Краторная булка N-200i'); // Проверяем содержание модалки

    // Закрываю модальное окно через кнопку
    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist'); // Проверяем, что модалка закрылась

    // Повторяю клик по первому ингредиенту для открытия модалки
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('@modal').should('exist');

    // Закрываю модалку, кликая по оверлею
    cy.get('[data-cy="modal-overlay"]').click('left', { force: true });
    cy.get('@modal').should('not.exist'); // Проверяю, что модалка закрыта
  });

  it('Тест создания заказа', () => {
    // Мокаю запрос на создание заказа
    cy.intercept('POST', `${URL}/orders`, { fixture: 'order.json' }).as(
      'orderBurgerApi'
    );

    cy.get('[data-cy="constructor"]').as('constructor');

    // Добавляю булочку и начинку
    cy.addItem('Булки');
    cy.addItem('Начинки');

    // Кликаю на кнопку для создания заказа
    cy.get('@constructor').children('div').children('button').click();

    // Ожидаю появления модального окна с номером заказа
    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').should('contain', '37865'); // Проверяю, что номер заказа правильный

    // Закрываю модалку через кнопку
    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist'); // Проверяю, что модалка закрыта

    // Проверяю, что ингредиенты больше не отображаются в конструкторе
    cy.get('@constructor').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('@constructor').should('not.contain', 'Краторная булка N-200i');

    // Ожидаю завершения запроса на создание заказа
    cy.wait('@orderBurgerApi');
  });
});
