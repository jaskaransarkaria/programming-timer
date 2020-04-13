<script>
  'use strict';
  import { onMount } from 'svelte';
  import {
    minsToMillis,
    millisToMinutesAndSeconds,
  } from '../utils/utils.js';

  const MAX_DURATION_LIMIT = minsToMillis(120);

  export let durationMins = minsToMillis(30);
  export let ws;
  export let sessionData;

  let displayTime = 'Start the timer';

  onMount(() => {
    if (!sessionData.newTimer) {
      calculateRemainingTime(sessionData);

      //TODO: store uid(s) as a session cookie or something?
    } else {
      startTimer(sessionData.Duration);
    }
    // probably want to return a function which closes the connection here
    return;
  });

  function calculateRemainingTime(existingSessionData) {
    const endTime = existingSessionData.EndTime;

    console.log('date now', Date.now());
    console.log('end time', endTime);
    console.log('calulate', endTime - Date.now());
    const remainingTimeMillis = endTime - Date.now();
    displayRemainingTime(remainingTimeMillis);
  }

  function startTimer(duration) {
    setTimer(duration);
  }

  function setTimer(duration) {
    displayRemainingTime(duration);
  }

  function sanitizeDurationProp(duration) {
    if (isNaN(duration)) {
      return 'Please enter a number';
    }
    if (duration <= 0) {
      return 'Please enter a larger timer duration';
    }
    if (duration > MAX_DURATION_LIMIT) {
      return 'The max timer length is 2 hours; enter a smaller timer length';
    }
    return duration;
  }

  function displayRemainingTime(remainingTime) {
    display(sanitizeDurationProp(remainingTime));
  }

  function display(remainingTimeMillis) {
    if (isNaN(remainingTimeMillis)) {
      return displayTime = remainingTimeMillis;
    } else {
      console.log('inside display',remainingTimeMillis);
      const interval = setInterval(() => {
        !isNaN(remainingTimeMillis) ?
          remainingTimeMillis -= updateTime(remainingTimeMillis) :
          clearInterval(interval);
      }, 1000);
      return;
    }
  }

  function updateTime (remainingTimeMillis) {
    if (remainingTimeMillis < 1000) {
      timesUp();
      return;
    } else {
      displayTime = millisToMinutesAndSeconds(remainingTimeMillis - 1000);
      return 1000;
    }
  }

  function timesUp() {
    displayTime = 'Times up!';
    return;
  }
</script>

<h1 data-testid="timer-header">{displayTime}</h1>
<h2>Session Id: {sessionData.SessionID}</h2>

<style>
</style>
