import '@testing-library/jest-dom/extend-expect';
import {
  render,
  fireEvent,
} from '@testing-library/svelte';
import SetupTimer from '../../src/timer/SetupTimer.svelte';
import * as mockHandleSession from '../../src/utils/handleSession';

jest.mock('../../src/utils/handleSession.js');

beforeEach(() => {
  mockHandleSession.newSession.mockClear();
  mockHandleSession.joinSession.mockClear();
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

  it('Existing session button clicked; show input to join the sesion', async () => {
    const { getByTestId } = render(SetupTimer);
    const joinSessionButton = getByTestId('setup-timer-existing-session-button');
    await fireEvent.click(joinSessionButton);
    expect(getByTestId('setup-timer-join-session-input')).toBeInTheDocument();
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
    await fireEvent.keyDown(input, { keyCode: '13' } );
    expect(mockHandleSession.newSession).toBeCalled();
  });

  it('expect join session POST to be called when join session code is input', async () => {
    mockHandleSession.joinSession.mockReturnValue({
      User: { UUID: 1234 },
      example: 'json',
    });
    const { getByTestId } = render(SetupTimer);
    const existingTimerButton = getByTestId('setup-timer-existing-session-button');
    await fireEvent.click(existingTimerButton);
    const input = getByTestId('setup-timer-join-session-input');
    expect(input).toBeInTheDocument();
    await fireEvent.input(input, { target: { value: '9' } });
    expect(input).toHaveValue('9');
    await fireEvent.keyDown(input, { keyCode: '13' });
    expect(mockHandleSession.joinSession).toBeCalled();
  });

  it('If enter pressed with a value inside the input, \
  the timer would not have mounted yet', async () => {
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    expect(input).toBeInTheDocument();
    await fireEvent.input(input, { target: { value: '9' } });
    expect(input).toHaveValue('9');
    await fireEvent.keyDown(input, { keyCode: '13' });
    expect(input).toHaveFocus();
    expect(input).toHaveValue('9');
  });
});
