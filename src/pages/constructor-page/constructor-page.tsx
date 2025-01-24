import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getIngredientsLoadingState } from '../../services/slices/IngredientStore';
import { Preloader } from '../../components/ui';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const loading = useSelector(getIngredientsLoadingState);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
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
      )}
    </>
  );
};
