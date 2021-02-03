// import '@testing-library/jest-dom/extend-expect';
// import { render } from '@testing-library/svelte';
// import TimerSVG from '../../src/timer/TimerSVG.svelte';

// beforeEach(() => jest.useFakeTimers());
// afterEach(() => jest.clearAllTimers());

// describe('visual timer which accurately refects the timer for a session', () => {
//   it('check that the svg path coords are correctly drawn', async () => {
//     const { getByTestId } = render(TimerSVG, {
//       duration: 10000,
//       startTimestamp: Date.now() - 10000,
//       displayTime: 'doesn\'t matter',
//     });
//     const svgPath = getByTestId('svg-path');
//     expect(svgPath).toBeInTheDocument();
//     await jest.advanceTimersByTime(5000);
//     expect(svgPath).toHaveAttribute(
//       'd',
//       expect.stringMatching('M140,30 L140,30 A110,110 0 1,1 139.9808013783256,30.000001675395794'),
//     );
//   });

//   it('ensure that all the svg components are there', () => {
//     const { getByTestId } = render(TimerSVG, {
//       duration: null,
//       startTimestamp: 0,
//       displayTime: 'doesn\'t matter',
//     });
//     const svgParent = getByTestId('svg-element-parent');
//     expect(svgParent).toContainElement(getByTestId('svg-path'));
//     expect(svgParent).toContainElement(getByTestId('svg-outer-circle'));
//     expect(svgParent).toContainElement(getByTestId('svg-text'));
//   });
// });
