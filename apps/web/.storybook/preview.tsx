import type { Preview } from '@storybook/nextjs';
import '../app/global.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
};

export default preview;
