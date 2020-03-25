import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/svelte';
import Greeeting from '../src/Greeting.svelte';

describe('Greeting button should display concat of first and last name', () => {
  it('change first name', () => {
    const { getByTestId } = render(Greeeting, { firstName : "Diana" });
    const greeting = getByTestId("greeting-header");
    expect(greeting).toHaveTextContent('Diana Coderson');
  });
  it('change second name', () => {
    const { getByTestId } = render(Greeeting, { lastName : "notCoderSon" });
    const greeting = getByTestId("greeting-header");
    expect(greeting).toHaveTextContent('Jasky notCoderSon');
  });
  it('change first and last name', () => {
    const { getByTestId } = render(Greeeting, { lastName : "notCoderSon" });
    const greeting = getByTestId("greeting-header");
    expect(greeting).toHaveTextContent('Jasky notCoderSon');
  });
});
