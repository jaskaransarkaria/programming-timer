<script>
  'use strict';
  import { onMount } from 'svelte';
  import {
    sendDriverNotification,
    sendNotification,
    newDriverNotification,
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
  const TIMER_REFRESH_RATE_MS = 50;
  const TIMES_UP_LIMIT_MS = TIMER_REFRESH_RATE_MS * 2;

  let showReset = false;
  let ws;
  let uuid;
  export let sessionData = {};
  let intervals = [
];
  let displayTime = 'Start the timer';

  async function wsOnMessageOverwrite (event) {
    showReset = false;
    clearTimer();
    try {
      sessionData = JSON.parse(event.data);
      if (sessionData.CurrentDriver.UUID === uuid) {
        newDriverNotification();
      }
      await calculateRemainingTime(sessionData);
    } catch {
      console.log('message received but event.data could not be parsed');
    }
  }
  onMount(async () => {
    ws = initWebsocket(wsOnMessageOverwrite);
    if (!sessionData.newTimer) {
      calculateRemainingTime(sessionData);
    } else {
      startTimer(sessionData.Duration);
      try {
        await navigator.clipboard.writeText(sessionData.SessionID);
      } catch (e) {
        console.error('Cannot execute navigator.clipboard.writeText');
      }
    }
    uuid = sessionStorage.getItem('uuid');
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
          remainingTimeMillis = updateTime(sessionData.EndTime - Date.now());
        }
      }, TIMER_REFRESH_RATE_MS);
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
    if (remainingTimeMillis <= TIMES_UP_LIMIT_MS) {
      clearTimer();
      timesUp();
    } else {
      displayTime = millisToMinutesAndSeconds(remainingTimeMillis);
      return remainingTimeMillis;
    }
  }

  function timesUp() {
    displayTime = 'Times up!';
    if (
      'CurrentDriver' in sessionData &&
      'UUID' in sessionData.CurrentDriver
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
  'SessionID' in sessionData ?
  `${sessionData.SessionID} (copied to clipboard!)` :
  'loading..'
}</h2>

{#if showReset}
<button on:click={() => updateSession(sessionData)}>Reset</button>
{/if}

<style>
</style>
