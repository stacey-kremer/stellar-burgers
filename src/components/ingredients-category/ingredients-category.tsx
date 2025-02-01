import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import {
  selectBun,
  selectIngredients
} from '../../services/slices/burgerDraft';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector(selectBun);
  const ingredientsList = useSelector(selectIngredients);
  // Используем useMemo для кэширования счетчиков ингредиентов, чтобы не пересчитывать их лишний раз
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    // Подсчитываем количество каждого ингредиента в списке
    ingredientsList.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 1;
      } else {
        counters[ingredient._id]++;
      }
    });
    // Для булочки счетчик всегда будет равен 2
    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [bun, ingredientsList]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
