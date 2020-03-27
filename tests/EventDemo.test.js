import '@testing-library/jest-dom/extend-expect';
import {
  render, fireEvent,
} from '@testing-library/svelte';
import EventDemo from '../src/EventDemo.svelte';

describe('pick up mouse movement', () => {

  it('move mouse inside div', async () => {
    const { getByTestId } = render(EventDemo);
    const mouseComponent = getByTestId('mouse-movement-div');

    await fireEvent.mouseMove(mouseComponent, {
      clientX : 10,
      clientY: 10,
    } );
    expect(mouseComponent).toHaveTextContent('10 x 10');
  });
});
