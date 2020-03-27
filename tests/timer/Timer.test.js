import '@testing-library/jest-dom/extend-expect';
import {
  render, fireEvent,
} from '@testing-library/svelte';
import Timer from '../../src/timer/Timer.svelte';

jest.useFakeTimers();

describe('take duration as an prop and start a timer which alerts on expiration', () => {
  it('alert after the duration has expired', async () => {
    const { getByTestId } = render(Timer, { duration: 1 });
    const timer = getByTestId('trigger-timer-button');
    const timerHeader = getByTestId('timer-header');

    await fireEvent.click(timer);

    expect(setTimeout).toBeCalledTimes(1);
    expect(timerHeader).toHaveTextContent('times up!');
  });
});
