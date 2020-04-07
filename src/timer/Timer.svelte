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
  export let existingSessionData;

  let sessionData;
  let displayTime = 'Start the timer';
  
  onMount(() => {
    if (existingSessionData) {
      calculateRemainingTime(existingSessionData);
    } else {
      startTimer(durationMins, ws);
    }
    // probably want to return a function which closes the connection here
    return;
  });

  function calculateRemainingTime(existingSessionData) {
    const endTime = existingSessionData.EndTime;
    const remainingTimeMillis = endTime - Date.now();
    displayRemainingTime(remainingTimeMillis);
    return;
  }

  async function startTimer(duration, ws) {
    setTimer(duration);
    await ws.send(JSON.stringify({
      duration: duration,
      startTime: Date.now(),
    }));
    ws.onmessage = (msg) => {
      try {
        sessionData = JSON.parse(msg.data);
      } catch (err) {
        console.log('data is not json', err);
        console.log(msg.data);
      }
    };
    return;
  }

  function setTimer(duration) {
    displayRemainingTime(sanitizeDurationProp(duration));
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

  function displayRemainingTime(remainingTime) {
    let remainingTimeMillis = remainingTime;
    setInterval(() => {
      !isNaN(remainingTimeMillis) ?
        remainingTimeMillis -= updateTime(remainingTimeMillis) :
        remainingTimeMillis;
    }, 1000);
    return;
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
{#if sessionData}
  <h2>Session Id: {sessionData.SessionID}</h2>
{/if}

<style>
</style>
