import '@testing-library/jest-dom/extend-expect';
import {
  render,
  fireEvent,
} from '@testing-library/svelte';
import SetupTimer from '../../src/timer/SetupTimer.svelte';
import * as mockHandleSession from '../../src/utils/handleSession';

jest.mock('../../src/router/router.js', () => {
  return {
    initRouter: jest.fn(() => '1234'),
    redirect: jest.fn(true),
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
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    expect(input).toBeInTheDocument();
    await fireEvent.input(input, { target: { value: '9' } });
    expect(input).toHaveValue('9');
    await fireEvent.keyDown(input, { keyCode: '13' });
    expect(mockHandleSession.newSession).toBeCalled();
  });

  it('expect join session POST to be called when join session URL is invoked', async () => {
    mockHandleSession.joinSession.mockReturnValue({
      User: { UUID: 1234 },
      example: 'json',
    });
    render(SetupTimer);
    expect(mockHandleSession.joinSession).toBeCalled();
  });
});
