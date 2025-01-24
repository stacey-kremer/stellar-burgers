import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectBun,
  selectIngredients,
  deleteItem,
  updateAll
} from '../../services/slices/burgerDraft';

// Компонент для отображения элемента конструктора бургера
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const bun = useSelector(selectBun); // Получаем выбранную булочку
    const ingredients = useSelector(selectIngredients); // Получаем список ингредиентов
    // Все элементы конструктора (булочка + ингредиенты)
    const constructorItems = { bun, ingredients };
    // Функция для перемещения элемента в списке
    const moveElement = (step: number) => {
      const updatedIngredients = [...constructorItems.ingredients];
      const [removed] = updatedIngredients.splice(index, 1); // Убираем элемент из текущего положения
      updatedIngredients.splice(index + step, 0, removed); // Вставляем его на новое место
      // Обновляем все ингредиенты в store
      dispatch(updateAll(updatedIngredients));
    };
    // Обработчик для перемещения элемента вниз
    const handleMoveDown = () => moveElement(1);
    // Обработчик для перемещения элемента вверх
    const handleMoveUp = () => moveElement(-1);
    // Обработчик для удаления элемента из конструктора
    const handleClose = () => {
      dispatch(deleteItem(ingredient)); // Удаляем ингредиент из состояния
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
