import '@testing-library/jest-dom/extend-expect';
import {
  render,
  fireEvent,
} from '@testing-library/svelte';
import SetupTimer from '../../src/timer/SetupTimer.svelte';

describe('conditional rendering of the Timer Component', () => {

  it('if newTimer true and hideInput false show input', async () => {
    const { getByTestId } = render(SetupTimer);
    const newTimerButton = getByTestId('setupTimer-newTimerButton');
    await fireEvent.click(newTimerButton);
    const input = getByTestId('setupTimer-input');

    expect(input).toBeInTheDOM();
  });

  it('if newTimer false show just newTimer button', () => {
    const { getByTestId } = render(SetupTimer);
    expect(getByTestId('setupTimer-newTimerButton')).toBeInTheDocument();
  });

  it.skip('if timer has been input show Timer', () => {});
});
