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
    initWebsocket,
    closeWs,
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

  /**
   * Process received WebSocket messages
   * Reset the timer and trigger neccessary notifications
   *
   * @param {object} event - incoming message
    */
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

  /**
   * On component mount:
   * initialise the WebSocket,
   * start the timer,
   * copy session ID to clipboard,
   * set `uuid`
   *
   * @return {fn} on component unmount close the WebSocket
    */
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

  /**
   * Calculate and display remaining time MS
   * for a pre-existing session
   *
   * @param {object} existingSessionData
   */
  function calculateRemainingTime(existingSessionData) {
    const endTime = existingSessionData.EndTime;
    const remainingTimeMillis = endTime - Date.now();
    displayRemainingTime(remainingTimeMillis);
  }

  /**
   * Start and display the timer
   * when a new session is created
   *
   * @param {number} duration - MS
   */
  function startTimer(duration) {
    displayRemainingTime(duration);
  }

  /**
   * @param {number} remainingTime - MS
   */
  function displayRemainingTime(remainingTime) {
    display(sanitizeDurationProp(remainingTime));
  }

  /**
   * Continously refresh the timer display
   * for the duration of the timer
   *
   * @param {number} remainingTimeMillis
   */
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

  /**
   * Ensure the correct timer length has been input
   *
   * @param {number} duration - MS
   * @return {string | number} reprompt for correct input | pass the valid duration through
   */
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

  /**
   * Handle updating the timer and indicate when time's up
   *
   * @param {number} remainingTimeMillis
   * @return {void | remainingTimeMillis}
   */
  function updateTime(remainingTimeMillis) {
    if (remainingTimeMillis <= TIMES_UP_LIMIT_MS) {
      clearTimer();
      timesUp();
    } else {
      displayTime = millisToMinutesAndSeconds(remainingTimeMillis);
      return remainingTimeMillis;
    }
  }

  /**
   * Handle when the timer has finished:
   * update the server with session data,
   * show relevant notification
   */
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

  /**
   * Clear the set Intervals responsible for displaying the timer
   */
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
