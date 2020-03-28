<script>
  'use strict';
  const MAX_DURATION_LIMIT = 120 * 60;
  export let durationSecs = 30;
  let remainingTimeSecs = 'display remaining time';

  function setTimer(duration) {
    remainingTimeSecs = sanitizeDurationProp(duration);

    if (!isNaN(remainingTimeSecs)) {
      setTimeout(() => timesUp(), duration*1000);
      displayRemainingTime();
      return;
    }
    return;
  }

  function displayRemainingTime() {
    setInterval(() => {
      !isNaN(remainingTimeSecs) ?
        remainingTimeSecs -= 1 :
        remainingTimeSecs;
    }, 1000);
    return;
  }

  function timesUp() {
    remainingTimeSecs = 'times up!';
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

<button data-testid="trigger-timer-button" on:click={() => setTimer(durationSecs)} />
<h1 data-testid="timer-header">{remainingTimeSecs}</h1>

<style>
</style>
