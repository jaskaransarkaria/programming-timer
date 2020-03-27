import '@testing-library/jest-dom/extend-expect';
import {
  render, fireEvent,
} from '@testing-library/svelte';
import BindingDemo from '../src/BindingDemo.svelte';

describe('value is bound between input and header', () => {

  it('correct value in header when passed in as prop', () => {
    const { getByTestId } = render(BindingDemo, { name: 'test' });
    const header = getByTestId('header-bind');
    expect(header).toHaveTextContent('test');
  });

  it('value is bound between input and header',async () => {
    const { getByTestId } = render(BindingDemo);
    const input = getByTestId('input-bind');
    await fireEvent.input(input, { target: { value : 'test input' } });

    expect(getByTestId('header-bind')).toHaveTextContent('Jello test input');
  });
});
