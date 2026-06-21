import { fadeInUp, staggerContainer } from '../animations/motionPresets';

export const sectionMotion = {
  variants: staggerContainer,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.2 },
};

export const cardMotion = (delay = 0) => ({
  variants: fadeInUp,
  transition: { duration: 0.5, delay },
});