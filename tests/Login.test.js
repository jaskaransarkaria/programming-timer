import '@testing-library/jest-dom/extend-expect';
import {
  render,
  fireEvent,
} from '@testing-library/svelte';
import Login from '../src/Login.svelte';

describe('log button should toggle text when clicked', () => {
  it('Log In button', async () => {
    const { getByText, getByTestId } = render(Login, { user: { loggedIn: false } });
    const logIn = getByText('Log In');
    await fireEvent.click(logIn);

    expect(getByTestId('log-out-button')).toHaveTextContent('Log Out');
  });

  it('Log In button', async () => {
    const { getByText, getByTestId  } = render(Login, { user: { loggedIn: true } });

    const logOut = getByText('Log Out');

    await fireEvent.click(logOut);
    expect(getByTestId('log-in-button')).toHaveTextContent('Log In');
  });
});
