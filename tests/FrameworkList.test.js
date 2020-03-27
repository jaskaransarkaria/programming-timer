import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/svelte';
import FrameworkList from '../src/FrameworkList.svelte';

describe('pass in framework array and create <li></li> for each item', () => {
  it('display the array of ojects passed in as a <ul><li></li></ul>', () => {
    const { getByText } = render(FrameworkList, {
      frameworks: [
        {
          id: 'testId1',
          name: 'testName1',
        },
        {
          id: 'testId2',
          name: 'testName2',
        },
        {
          id: 'testId3',
          name: 'testName3',
        },
      ],
    },
    );
    expect(getByText('testId1 : testName1')).toBeVisible();
    expect(getByText('testId2 : testName2')).toBeVisible();
    expect(getByText('testId3 : testName3')).toBeVisible();
  });
  it('pass in array of objects with insufficient properties', () => {
    const { getByTestId } = render(FrameworkList, {
      frameworks: [
        { id: 'x' },
      ],
    },
    );
    const frameworkComponent = getByTestId('framework-ul');
    expect(frameworkComponent).toContainHTML(
      '<li>x : undefined </li>',
    );
  });

  it('pass in empty array', () => {
    const { getByTestId } = render(FrameworkList, {
      frameworks: [
      ],
    },
    );
    const frameworkComponent = getByTestId('framework-ul');
    expect(frameworkComponent).toBeInTheDocument();
  });
  it('Do not pass in a frameworks array and this should use the default', () => {
    const { getByText } = render(FrameworkList);

    expect(getByText('1 : Svelte')).toBeVisible();
    expect(getByText('2 : Angular')).toBeVisible();
    expect(getByText('3 : React')).toBeVisible();
  });
});
