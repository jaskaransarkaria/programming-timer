<script>
  'use strict';
  import { onMount } from 'svelte';
  import {
    sendDriverNotification,
    sendNotification,
} from '../utils/notification.js';
  import {
    minsToMillis,
    millisToMinutesAndSeconds,
  } from '../utils/utils.js';
  import {
    initWebsocket, closeWs,
}from '../utils/websocket.js';
  import { updateSession } from '../utils/handleSession.js';
  import TimerSVG from './TimerSVG.svelte';


  const MAX_DURATION_LIMIT = minsToMillis(120);

  let showReset = false;
  let ws;
  export let sessionData = {};
  let intervals = [
];
  let displayTime = 'Start the timer';

  const wsOnMessageOverwrite = async (event) => {
    showReset = false;
    clearTimer();
    try {
      sessionData = JSON.parse(event.data);
      await calculateRemainingTime(sessionData);
    } catch {
      console.log('message received but event.data could not be parsed');
    }
};

  onMount(() => {
    ws = initWebsocket(wsOnMessageOverwrite);
    if (!sessionData.newTimer) {
      calculateRemainingTime(sessionData);
    } else {
      startTimer(sessionData.Duration);
    }
    return () => closeWs(ws);
  });

  function calculateRemainingTime(existingSessionData) {
    const endTime = existingSessionData.EndTime;
    const remainingTimeMillis = endTime - Date.now();
    displayRemainingTime(remainingTimeMillis);
  }

  function startTimer(duration) {
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
    }
  }

  function sanitizeDurationProp(duration) {
    if (isNaN(duration)) {
      return 'Please enter a number (mins) between 0 and 120';
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
    // need both conditional statements -- guard against timers getting out of sync
    if (sessionData.EndTime - Date.now() <= 500 || remainingTimeMillis <= 500) {
      clearTimer();
      timesUp();
    } else {
      displayTime = millisToMinutesAndSeconds(remainingTimeMillis - 1000);
      return 1000;
    }
  }

  function timesUp() {
    displayTime = 'Times up!';
    const uuid = sessionStorage.getItem('uuid');
    if (
      Object.prototype.hasOwnProperty.call(sessionData, 'CurrentDriver') &&
      Object.prototype.hasOwnProperty.call(sessionData.CurrentDriver, 'UUID')
    ) {
      if (uuid === sessionData.CurrentDriver.UUID && !(Number.isInteger(displayTime))) {
        showReset = true;
        const notification = sendDriverNotification();
        notification.onclick = () => {
          updateSession(sessionData);
          notification.close();
        };
      } else {
        sendNotification();
      }
    }
  }

  function clearTimer() {
    intervals.forEach(interval => clearInterval(interval));
    intervals = [
    ];
  }
</script>

<TimerSVG duration={sessionData.Duration} startTimestamp={sessionData.StartTime} displayTime={displayTime}/>
<h2>Session Id: {
  Object.prototype.hasOwnProperty.call(sessionData, 'SessionID') ?
  sessionData.SessionID :
  'loading..'
}</h2>

{#if showReset}
<button on:click={() => updateSession(sessionData)}>Reset</button>
{/if}

<style>
</style>
