export function minsToMillis(mins) {
  return mins * 60 * 1000;
}

export function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  // eslint-disable-next-line multiline-ternary
  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
}

/**
 * Ensure the correct timer length has been input
 *
 * @param {number} duration - MS
 * @return {string | number} reprompt for correct input | pass the valid duration through
 */
export function validateInput(duration, maxDuration) {
  if (isNaN(duration)) {
    return 'Please enter a number (mins) between 0 and 120';
  }
  if (duration <= 0) {
    return 'Please enter a larger timer duration';
  }
  if (duration > maxDuration) {
    return 'The max timer length is 2 hours; enter a smaller timer length';
  }
  return duration;
}
