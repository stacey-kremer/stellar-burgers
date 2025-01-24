import { FC, useMemo } from 'react';
import { getIngredientsState } from '../../services/slices/IngredientStore';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { ingredients, loading, error } = useSelector(getIngredientsState);
  const { id } = useParams();
  // Используем useMemo для поиска ингредиента по id, чтобы избежать лишних перерасчетов
  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id),
    [ingredients, id]
  );

  if (loading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
