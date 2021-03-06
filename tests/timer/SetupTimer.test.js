import '@testing-library/jest-dom/extend-expect';
import {
  render,
  fireEvent,
} from '@testing-library/svelte';
import SetupTimer from '../../src/timer/SetupTimer.svelte';
import * as mockHandleSession from '../../src/utils/handleSession';
import * as mockRouter from '../../src/router/router';

jest.mock('../../src/router/router.js', () => {
  return {
    initRouter: jest.fn(),
    redirect: jest.fn(() => true),
  };
});
jest.mock('../../src/utils/handleSession.js');
jest.mock('../../src/utils/websocket.js');
jest.mock('../../src/utils/notification.js');

const mockClipboard = { writeText: jest.fn() };

beforeEach(() => {
  mockHandleSession.newSession.mockClear();
  mockHandleSession.joinSession.mockClear();
  global.navigator.clipboard = mockClipboard;
});

describe('Conditional rendering of the Timer Component', () => {
  it('if input <= 0 then don\'t begin timer and reprompt', async () => {
    const { getByTestId, getByText } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    await fireEvent.input(input, { target: { value: '0' } });
    await fireEvent.keyDown(input, { keyCode: '13' });
    const timerText = getByText('Please enter a larger timer duration');
    expect(timerText).toBeInTheDocument();
  });

  it('if duration input is too large then don\'t begin timer', async () => {
    const { getByText, getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    await fireEvent.input(input, { target: { value: '121' } });
    await fireEvent.keyDown(input, { keyCode: '13' });
    const timerText = getByText('The max timer length is 2 hours; enter a smaller timer length');
    expect(timerText).toBeInTheDocument();
  });

  it('if duration isNaN(), then don\'t begin timer and reprompt', async () => {
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    await fireEvent.input(input, { target: { value: 'NOT A NUMBER' } });
    await fireEvent.keyDown(input, { keyCode: '13' });
    const timerText = getByTestId('setup-timer-new-timer-input');
    expect(timerText).toBeInTheDocument();
  });

  it('if no input passed prompt a number', async () => {
    const { getByText, getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    await fireEvent.input(input, { target: { value: '' } });
    await fireEvent.keyDown(input, { keyCode: '13' });
    const timerText = getByText('Please enter a larger timer duration');
    expect(timerText).toBeInTheDocument();
  });

  it('If newTimer true and hideInput false show input', async () => {
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    expect(input).toBeInTheDocument();
  });

  it('If newTimer false show just newTimer button', () => {
    const { getByTestId } = render(SetupTimer);
    expect(getByTestId('setup-timer-new-timer-button')).toBeInTheDocument();
  });

  it('expect new session POST to be called when new session time is input', async () => {
    mockHandleSession.newSession.mockReturnValue({
      User: { UUID: 1234 },
      example: 'json',
    });
    mockRouter.initRouter.mockReturnValue(undefined);
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    expect(input).toBeInTheDocument();
    await fireEvent.input(input, { target: { value: 9 } });
    expect(input).toHaveValue(9);
    await fireEvent.keyDown(input, { keyCode: '13' });
    expect(mockHandleSession.newSession).toBeCalled();
  });

  it('expect join session POST to be called when join session URL is invoked', () => {
    mockHandleSession.joinSession.mockReturnValue({
      User: { UUID: 1234 },
      example: 'json',
    });
    mockRouter.initRouter.mockImplementation(jest.fn(() => '/1234'));
    render(SetupTimer);
    expect(mockHandleSession.joinSession).toBeCalled();
  });
});
