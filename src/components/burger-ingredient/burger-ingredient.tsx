import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addItem } from '../../services/slices/burgerDraft';

// Компонент для отображения ингредиента бургера
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    // Функция для добавления ингредиента в конструктор
    const handleAdd = () => {
      const item = { ...ingredient, id: ingredient._id };
      dispatch(addItem(item));
    };

    const locationState = { background: location };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={locationState}
        handleAdd={handleAdd}
      />
    );
  }
);
