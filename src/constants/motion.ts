import { Transition, Variants } from 'framer-motion';

// Пружина, на якій стоїть більшість «виїздів» елементів на сторінках.
export const springTransition: Transition = {
  type: 'spring',
  duration: 2,
  bounce: 0.4,
};


export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 50, transition: springTransition },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

// Крива, на якій стоять майже всі анімації появи елементів по в'юпорту.
export const easeCurve: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// Контейнер лише для каскаду: сам нічого не анімує, а діти беруть стан за
// назвою варіанта. Раніше цей порожній обʼєкт оголошувався в кожному
// компоненті окремо.
export const emptyVariants: Variants = {
  hidden: {},
  visible: {},
};

// Хелпери нижче кешують результат за аргументами. Їх викликають прямо в тілі
// компонентів, а значення там мають бути стабільними: новий обʼєкт щорендер —
// це і алокація, і нове посилання для framer-motion. Аргументи в проєкті
// беруться з невеликого набору чисел, тож кеш не росте.
const easeTransitions = new Map<number, Transition>();
const slideUpVariants = new Map<string, Variants>();
const staggerVariants = new Map<string, Variants>();

// Плавний ease-in-out, яким анімуються появи елементів по в'юпорту.
export const getEaseTransition = (duration = 0.6): Transition => {
  let transition = easeTransitions.get(duration);

  if (!transition) {
    transition = { duration, ease: easeCurve };
    easeTransitions.set(duration, transition);
  }

  return transition;
};

// Елемент виїжджає знизу (за замовчуванням на 50px) із проявою.
// Контейнер, що сам нічого не анімує, а лише запускає дітей по черзі:
// stagger — пауза між дітьми, delay — перед першою дитиною (секунди).
export const getStaggerVariants = (stagger: number, delay = 0): Variants => {
  const key = `${stagger}:${delay}`;
  let variants = staggerVariants.get(key);

  if (!variants) {
    variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
          ...(delay ? { delayChildren: delay } : {}),
        },
      },
    };
    staggerVariants.set(key, variants);
  }

  return variants;
};

// Список, чиї елементи по черзі з'являються знизу (fade + зсув по y).
export const revealListVariants = getStaggerVariants(0.1);

export const getSlideUpVariants = (duration = 0.6, distance = 50): Variants => {
  const key = `${duration}:${distance}`;
  let variants = slideUpVariants.get(key);

  if (!variants) {
    const transition = getEaseTransition(duration);

    variants = {
      hidden: { y: distance, opacity: 0, transition },
      visible: { y: 0, opacity: 1, transition },
    };
    slideUpVariants.set(key, variants);
  }

  return variants;
};
