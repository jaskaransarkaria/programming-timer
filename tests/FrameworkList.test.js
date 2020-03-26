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
          id: 'testId2',
          name: 'testName2',
        },
      ],
    },
    );
    expect(getByText('testId1 : testName1')).toBeVisible('testId1 : testName1');
    expect(getByText('testId2 : testName2')).toBeVisible('testId2 : testName2');
    expect(getByText('testId3 : testName3')).toBeVisible('testId3 : testName3');
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
});
