export function minsToMillis(mins) {
  return mins * 60 * 1000;
}

export function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  // eslint-disable-next-line multiline-ternary
  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
}
