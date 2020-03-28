<script>
  'use strict';
  const MAX_DURATION_LIMIT = convertMinsToMillis(120);
  export let durationMins = convertMinsToMillis(30);
  let displayTime = 'Start the timer';
  let remainingTimeMillis;

  function setTimer(duration) {
    remainingTimeMillis = sanitizeDurationProp(duration);

    if (!isNaN(remainingTimeMillis)) {
      setTimeout(() => timesUp(), duration);
      displayRemainingTime();
      return;
    }
    return displayTime = remainingTimeMillis;
  }

  function convertMinsToMillis(mins) {
    return mins*60*1000;
  }

  function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    // eslint-disable-next-line multiline-ternary
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  }

  function displayRemainingTime() {
    setInterval(() => {
      !isNaN(remainingTimeMillis) ?
        updateTime :
        remainingTimeMillis;
    }, 1000);
    return;
  }

  function updateTime () {
    displayTime = millisToMinutesAndSeconds(remainingTimeMillis - 1000);
    remainingTimeMillis -= 1000;
    return;
  }

  function timesUp() {
    displayTime = 'Times up!';
    return;
  }

  function sanitizeDurationProp(duration) {
    if (isNaN(duration)) {
      return 'Please enter a number';
    }
  
    if (duration <= 0) {
      return 'Please enter a larger timer duration';
    }
  
    if (duration > MAX_DURATION_LIMIT) {
      return 'The max timer length is 2 hours enter a small timer length';
    }

    return duration;
  }
</script>

<button data-testid="trigger-timer-button" on:click={() => setTimer(durationMins)} />
<h1 data-testid="timer-header">{displayTime}</h1>

<style>
</style>
