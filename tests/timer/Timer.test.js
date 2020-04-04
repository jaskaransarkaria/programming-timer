import '@testing-library/jest-dom/extend-expect';
import {
  render, fireEvent,
} from '@testing-library/svelte';
import Timer from '../../src/timer/Timer.svelte';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

describe('take duration as an prop and start a timer which alerts on expiration', () => {
  it('alert after the duration has expired', async () => {
    const { getByTestId } = render(Timer, {
      durationMins: 1,
      uuid: 'example',
      ws: { send: () => { return true; } },
    });
    const timer = getByTestId('trigger-timer-button');
    const timerHeader = getByTestId('timer-header');

    expect(timerHeader).toHaveTextContent('Start the timer');
    await fireEvent.click(timer);
    await jest.advanceTimersByTime(1*60*1000);

    expect(setTimeout).toBeCalledTimes(1);
    expect(setInterval).toBeCalledTimes(1);
    expect(timerHeader).toHaveTextContent('Times up!');
  });

  it('if duration isNaN(), then don\'t begin timer and reprompt', async () => {
    const { getByTestId } = render(Timer, {
      durationMins: 'not a number',
      uuid: 'example',
      ws: { send: () => { return true; } },
    });
    const timer = getByTestId('trigger-timer-button');
    const timerHeader = getByTestId('timer-header');

    expect(timerHeader).toHaveTextContent('Start the timer');
    await fireEvent.click(timer);
    expect(timerHeader).toHaveTextContent('Please enter a number');
  });

  it('if no prop passed in the use default 30 mins', async () => {
    const { getByTestId } = render(Timer, {
      uuid: 'example',
      ws: { send: () => { return true; } },
    });
    const timer = getByTestId('trigger-timer-button');
    const timerHeader = getByTestId('timer-header');

    expect(timerHeader).toHaveTextContent('Start the timer');
    await fireEvent.click(timer);
    await jest.advanceTimersByTime(31*60*1000);

    expect(setTimeout).toBeCalledTimes(1);
    expect(setInterval).toBeCalledTimes(1);
    expect(timerHeader).toHaveTextContent('Times up!');
  });

  it('if duration prop <= 0 then don\'t begin timer and reprompt', async () => {
    const { getByTestId } = render(Timer, {
      durationMins: -1,
      uuid: 'example',
      ws: { send: () => { return true; } },
    });
    const timer = getByTestId('trigger-timer-button');
    const timerHeader = getByTestId('timer-header');

    expect(timerHeader).toHaveTextContent('Start the timer');
    await fireEvent.click(timer);

    expect(setTimeout).toBeCalledTimes(0);
    expect(setInterval).toBeCalledTimes(0);
    expect(timerHeader).toHaveTextContent('Please enter a larger timer duration');
  });

  it('if duration prop is too large then don\'t begin timer and reprompt', async () => {
    const { getByTestId } = render(Timer, {
      durationMins: 121 * 60 * 1000,
      uuid: 'example',
      ws: { send: () => { return true; } },
    });
    const timer = getByTestId('trigger-timer-button');
    const timerHeader = getByTestId('timer-header');

    expect(timerHeader).toHaveTextContent('Start the timer');
    await fireEvent.click(timer);

    expect(setTimeout).toBeCalledTimes(0);
    expect(setInterval).toBeCalledTimes(0);
    expect(timerHeader).toHaveTextContent(
      'The max timer length is 2 hours enter a small timer length',
    );
  });
});
