import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/svelte';
import Timer from '../../src/timer/Timer.svelte';
import * as mockWebsocket from '../../src/utils/websocket';

jest.mock('../../src/utils/websocket.js');

beforeEach(() => {
  mockWebsocket.initWebsocket.mockClear();
  mockWebsocket.initWebsocket.mockReturnValue(true);
  mockWebsocket.closeWs.mockReturnValue(true);
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

describe('take duration as a prop and start a timer which alerts on expiration', () => {
  it('OnMount new Websocket()', () => {
    render(Timer);
    expect(mockWebsocket.initWebsocket).toBeCalled();
  });

  it('alert after the duration has expired', async () => {
    render(Timer, {
      sessionData: {
        newTimer: true,
        Duration: 1 *60 * 1000,
        EndTime: Date.now(),
      },
    });
    await jest.advanceTimersByTime(1*61*1000);
    expect(setInterval).toBeCalledTimes(2);
  });

  it('if duration prop <= 0 then don\'t begin timer and reprompt', () => {
    render(Timer, {
      sessionData: {
        newTimer: true,
        Duration: -1,
      },
    });
    expect(setInterval).toBeCalledTimes(1);
  });

  it('existing SessionID passed in, so should be displayed', () => {
    const remainingTime = Date.now() + (119 * 60 * 1000);
    const { getByText } = render(Timer, {
      sessionData: {
        newTimer: false,
        SessionID: '1234',
        Duration: 121 * 60 * 1000,
        StartTime: Date.now() - (119 * 60 * 1000),
        EndTime: remainingTime,
        Users: [
          'randomUser',
        ],
      },
    });
    expect(getByText('Session Id: 1234')).toBeInTheDocument();
  });

  it('if duration prop is too large then don\'t begin timer', () => {
    const { getByText } = render(Timer, {
      sessionData: {
        newTimer: true,
        Duration: 121 * 60 * 1000,
      },
    });
    const timerText = getByText('The max timer length is 2 hours; enter a smaller timer length');
    expect(setInterval).toBeCalledTimes(1);
    expect(timerText).toBeInTheDocument();
  });

  it('if duration isNaN(), then don\'t begin timer and reprompt', () => {
    const { getByText } = render(Timer, {
      sessionData: {
        newTimer: true,
        Duration: 'not a number',
      },
    });
    const timerText = getByText('Please enter a number (mins) between 0 and 120');
    expect(timerText).toBeInTheDocument();
  });

  it('if no prop passed prompt a number', () => {
    const { getByText } = render(Timer, { sessionData: { newTimer: true } });
    const timerText = getByText('Please enter a number (mins) between 0 and 120');
    expect(timerText).toBeInTheDocument();
  });

  it('pass in existing session\'s SessionData and display it correctly', async () => {
    const currentTime = Date.now();
    const { getByText } = render(Timer, {
      sessionData: {
        newTimer: false,
        SessionID : '1234',
        Duration: 119 * 60 * 1000,
        StartTime: currentTime,
        EndTime: currentTime + (119 * 60 * 1000),
        Users: [
          'randomUser',
        ],
      },
    });
    const timerText = getByText('Start the timer');
    await jest.advanceTimersByTime(119*60*1000);
    expect(setInterval).toBeCalledTimes(2);
    expect(timerText).toHaveTextContent('Times up!');
  });
});
