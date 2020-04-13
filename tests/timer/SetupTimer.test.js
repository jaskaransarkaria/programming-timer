import '@testing-library/jest-dom/extend-expect';
import {
  render,
  fireEvent,
} from '@testing-library/svelte';
import SetupTimer from '../../src/timer/SetupTimer.svelte';
import * as mockWebsocket from '../../src/utils/websocket';

jest.mock('../../src/utils/websocket.js');

beforeEach(() => {
  mockWebsocket.default.mockClear();
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

  it.skip('If enter in the input, input will be removed', async () => {
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    expect(input).toBeInTheDocument();
    // await fireEvent.input(input, { target: { value: '99' } });
    await fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
    });
    await setTimeout(console.log('waiting'), 1000);
    expect(input).not.toBeInTheDocument();
  });

  it('Existing session button clicked; show input to join the sesion', async () => {
    const { getByTestId } = render(SetupTimer);
    const joinSessionButton = getByTestId('setup-timer-existing-session-button');
    await fireEvent.click(joinSessionButton);
    expect(getByTestId('setup-timer-join-session-input')).toBeInTheDocument();
  });

  it('OnMount new Websocket()', () => {
    render(SetupTimer);
    expect(mockWebsocket.default).toBeCalled();
  });

  it.skip('When join session is clicked, store the response in existingSessionData', async () => {
    const { getByTestId } = render(SetupTimer);
    const joinSessionButton = getByTestId('setup-timer-existing-session-button');
    await fireEvent.click(joinSessionButton);
    const input = getByTestId('setup-timer-join-session-input');
    expect(input).toBeInTheDocument();
    await fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
    });
    expect(mockWebsocket.sendAndListenToExistingSession).toBeCalled();
  });
});
