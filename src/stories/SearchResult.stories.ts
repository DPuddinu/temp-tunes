import type { Meta, StoryObj } from '@storybook/react';

import SearchResultTable from './SearchResult';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof SearchResultTable> = {
  title: 'SearchResult',
  component: SearchResultTable,
  tags: ['autodocs'],
  argTypes: {
    data: []
  },
};

export default meta;
type Story = StoryObj<typeof SearchResultTable>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    data: []
  },
};

export const Secondary: Story = {
  args: {
    data: []
  },
};
