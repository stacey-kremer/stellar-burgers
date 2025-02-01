import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getIngredientsList,
  getIngredientsErrorState
} from '../../services/slices/IngredientStore';
import { Preloader } from '../../components/ui';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredientsList);
  const error = useSelector(getIngredientsErrorState);

  // Локальные состояния для загрузки и ошибок
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Эмулируем асинхронную загрузку данных
    const loadIngredients = async () => {
      try {
        // Пример вызова экшена для получения данных
        await dispatch(getIngredientsList());
        setLoading(false); // Данные загружены, устанавливаем loading в false
      } catch (err) {
        setLoading(false); // Ошибка при загрузке, устанавливаем loading в false
      }
    };

    loadIngredients();
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Не удалось загрузить ингредиенты. Попробуйте позже.</p>;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
