import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { getIngredientsState } from '../../services/slices/IngredientStore';
import { Preloader } from '../ui/preloader';

export const BurgerIngredients: FC = () => {
  const { ingredients, loading, error } = useSelector(getIngredientsState);
  // Классификация ингредиентов по типам (булочки, основные, соусы)
  const categorizedIngredients = {
    bun: ingredients.filter((ingredient) => ingredient.type === 'bun'),
    main: ingredients.filter((ingredient) => ingredient.type === 'main'),
    sauce: ingredients.filter((ingredient) => ingredient.type === 'sauce')
  };

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  // Ссылки на заголовки секций, чтобы прокручивать их при переключении вкладок
  const titleRefs = {
    bun: useRef<HTMLHeadingElement>(null),
    main: useRef<HTMLHeadingElement>(null),
    sauce: useRef<HTMLHeadingElement>(null)
  };
  // Хуки для отслеживания видимости каждой категории ингредиентов
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewMains] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Эффект для смены вкладки в зависимости от того, какая категория ингредиентов видна
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewMains) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewMains, inViewSauces]);
  // Обработчик клика по вкладке
  const onTabClick = (tab: TTabMode) => {
    setCurrentTab(tab);
    titleRefs[tab].current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (error) {
    return <p>Упс... что-то пошло не так...</p>;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={categorizedIngredients.bun}
      mains={categorizedIngredients.main}
      sauces={categorizedIngredients.sauce}
      titleBunRef={titleRefs.bun}
      titleMainRef={titleRefs.main}
      titleSaucesRef={titleRefs.sauce}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={(tab: string) => onTabClick(tab as TTabMode)}
    />
  );
};
