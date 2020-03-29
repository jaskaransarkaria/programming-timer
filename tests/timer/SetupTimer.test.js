import '@testing-library/jest-dom/extend-expect';
import {
  render,
  fireEvent,
} from '@testing-library/svelte';
import SetupTimer from '../../src/timer/SetupTimer.svelte';

describe('Conditional rendering of the Timer Component', () => {

  it('If newTimer true and hideInput false show input', async () => {
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');

    expect(input).toBeInTheDOM();
  });

  it('If newTimer false show just newTimer button', () => {
    const { getByTestId } = render(SetupTimer);
    expect(getByTestId('setup-timer-new-timer-button')).toBeInTheDocument();
  });

  it('If enter in the input, input will be removed', async () => {
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    await fireEvent.input(input, { target: { value: '99' } });
    await fireEvent.keyDown(input, { keyCode: 13 });
    expect(input).not.toBeInTheDocument();
  });

  it('Show start timer button when time has been input', async () => {
    const { getByText, getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setup-timer-new-timer-button');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setup-timer-new-timer-input');
    await fireEvent.input(input, { target: { value: '9' } });
    expect(getByText('Start Timer')).toBeInTheDocument();
  });

  it('Existing session button clicked; show input to join the session', async () => {
    const { getByTestId } = render(SetupTimer);
    const existingSessionButton = getByTestId('setup-timer-existing-session-button');
    await fireEvent.click(existingSessionButton);
    expect(getByTestId('setup-timer-join-session-input')).toBeInTheDocument();
  });

  it.skip('When the unique session is input, join and display that session', () => {});
});
