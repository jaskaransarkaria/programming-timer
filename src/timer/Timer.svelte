<script>
  'use strict';
  import {
    minsToMillis,
    millisToMinutesAndSeconds,
  } from '../utils/utils.js';

  const MAX_DURATION_LIMIT = minsToMillis(120);
  export let durationMins = minsToMillis(30);
  export let uuid;
  export let ws;
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

  function displayRemainingTime() {
    setInterval(() => {
      !isNaN(remainingTimeMillis) ?
        updateTime() :
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
    remainingTimeMillis = 'stop';
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

  function startTimer(duration, uuid, ws) {
    console.log('uuid', uuid);
    setTimer(duration);
    ws.send(JSON.stringify({
      uuid,
      duration,
      startTime: Date.now(),
    }));
  }
</script>

<button data-testid="trigger-timer-button" on:click={startTimer(durationMins, uuid, ws)} >
  Start Timer
</button>
<h1 data-testid="timer-header">{displayTime}</h1>

<style>
</style>
