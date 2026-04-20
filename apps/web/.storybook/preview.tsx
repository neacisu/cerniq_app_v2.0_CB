import type { Preview } from '@storybook/nextjs';
import '../app/global.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    /** addon-a11y + axe-core: raportări ca erori în Storybook (blueprint §17). */
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
