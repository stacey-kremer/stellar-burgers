import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  selectIngredients,
  selectLoading,
  selectError
} from '../../services/slices/IngredientStore';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(selectIngredients); // Используем правильный селектор
  const loading = useSelector(selectLoading); // Используем правильный селектор
  const error = useSelector(selectError); // Используем правильный селектор
  const { id } = useParams();

  // Используем useMemo для поиска ингредиента по id, чтобы избежать лишних перерасчетов
  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id),
    [ingredients, id]
  );

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Упс... что-то пошло не так...</p>;
  }

  if (!ingredientData) {
    return <p>Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
