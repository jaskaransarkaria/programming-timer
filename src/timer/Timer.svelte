<script>
  'use strict';
  import { onMount } from 'svelte';
  import {
    minsToMillis,
    millisToMinutesAndSeconds,
  } from '../utils/utils.js';
  import Websocket from '../utils/websocket.js';
  import { updateSession } from '../utils/handleSession.js';

  const MAX_DURATION_LIMIT = minsToMillis(120);

  let ws;
  export let sessionData;

  let intervals = [
];
  let displayTime = 'Start the timer';

  onMount(() => {
    ws = new Websocket();
    ws.ws.onmessage = async (event) => {
      try {
        sessionData = JSON.parse(event.data);
        if (intervals.length === 0) {
          await calculateRemainingTime(sessionData);
          console.log(sessionData.CurrentDriver);
          console.log(event.data);

        } else {
          console.log('caught a double');
        }
      } catch {
        console.log('message recieved but event.data could not be parsed');
      }
    };
    if (!sessionData.newTimer) {
      calculateRemainingTime(sessionData);
    } else {
      startTimer(sessionData.Duration);
    }
    return () => ws.ws.close();
  });

  function calculateRemainingTime(existingSessionData) {
    const endTime = existingSessionData.EndTime;
    const remainingTimeMillis = endTime - Date.now();
    displayRemainingTime(remainingTimeMillis);
  }

  function startTimer(duration) {
    setTimer(duration);
  }

  function setTimer(duration) {
    displayRemainingTime(duration);
  }
  
  function displayRemainingTime(remainingTime) {
    display(sanitizeDurationProp(remainingTime));
  }
  
  function display(remainingTimeMillis) {
    if (isNaN(remainingTimeMillis)) {
      return displayTime = remainingTimeMillis;
    } else {
      const currentInterval = setInterval(() => {
        if (!isNaN(remainingTimeMillis)) {
          remainingTimeMillis -= updateTime(remainingTimeMillis);
        }
      }, 1000);
      intervals.push(currentInterval);
      console.log('adding to intervals', intervals);
    }
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

  function updateTime (remainingTimeMillis) {
    if (sessionData.EndTime - Date.now() <= 1000) {
      timesUp();
    } else {
      displayTime = millisToMinutesAndSeconds(remainingTimeMillis - 1000);
      return 1000;
    }
  }

  async function timesUp() {
    displayTime = 'Times up!';
    intervals.forEach(interval => clearInterval(interval));
    intervals = [
    ];
    console.log(intervals);
    const uuid = sessionStorage.getItem('uuid');
    if (uuid === sessionData.CurrentDriver.UUID && !(Number.isInteger(displayTime))) {
      await updateSession(sessionData);
    }
  }
</script>

<h1 data-testid="timer-header">{displayTime}</h1>
<h2>Session Id: {sessionData.SessionID}</h2>

<style>
</style>
