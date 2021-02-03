
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
    validateInput,
  } from '../utils/utils.js';
  import {
    initWebsocket,
    closeWs,
}from '../utils/websocket.js';
  import {
    updateSession,
    pauseSession,
} from '../utils/handleSession.js';
  import TimerSVG from './TimerSVG.svelte';

  const MAX_DURATION_LIMIT = minsToMillis(120);
  const TIMER_REFRESH_RATE_MS = 50;
  const TIMES_UP_LIMIT_MS = TIMER_REFRESH_RATE_MS * 2;
  // sound needs to stored in var here so they can be accessed when the tab is inactive
  const notifySound = new Audio('/deduction.mp3');
  const newDriverSound = new Audio('/open-ended.mp3');

  export let sessionData = {};
  let showReset = false;
  export let invalidInput = false;
  export let message = '';
  let ws;
  const uuid = sessionStorage.getItem('uuid');
  let intervals = [ ];
  let displayTime = 'Start the timer';
  let updatedDuration;
  let pause = false;

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
        newDriverNotification(newDriverSound);
        message = 'You are the driver!';
      } else {
        message = '';
      }
      await calculateRemainingTime(sessionData);
    } catch (e) {
      console.log('message received but event.data could not be parsed', e);
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
      console.log(sessionData);
      try {
        await navigator.clipboard.writeText(
          `https://pairprogrammingtimer.com/${sessionData.SessionID}`);
        message = 'url copied to clipboard!';
      } catch (e) {
        console.error('Cannot execute navigator.clipboard.writeText');
      }
    }
    return () => closeWs(ws);
  });

  /**
   * Calculate and display remaining time MS
   * for a pre-existing session
   *
   * @param {object} existingSessionData
   */
  function calculateRemainingTime(existingSessionData) {
    if (existingSessionData.PauseTime !== 0){
      console.log('calculating pause timer');
      const endTime = existingSessionData.EndTime;
      const pauseTime = existingSessionData.PauseTime;
      const remainingTimeMillis = endTime - pauseTime;
      displayRemainingTime(remainingTimeMillis);
    } else {
        const endTime = existingSessionData.EndTime;
        const remainingTimeMillis = endTime - Date.now();
        displayRemainingTime(remainingTimeMillis);
    }
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
    display(remainingTime);
  }

  /**
   * Handle pause button, starts a new pause timer for duration of pause
   *
   *
   *
   */

  function handlePause() {
    clearTimer();
    const pauseMoment = Date.now();
    const remainingMillis = sessionData.EndTime - pauseMoment;
    pauseSession(sessionData.SessionID, pauseMoment);
    // updatedDuration = displayTime;
    setInterval(() => {
      sessionData.StartTime = Date.now() + remainingMillis;
    }, 30);
    displayTime = displayTime.toString();
    // need remaining millis seconds and an interval to keep track of it assign it to StartTime
    console.log('pausing');
  }

  /**
   * Continously refresh the timer display
   * for the duration of the timer, unless timer is paused
   *
   * @param {number} remainingTimeMillis
   */
  function display(remainingTimeMillis) {
    if (pause){
      displayTime = 'Paused';
      return;
    } else if (isNaN(remainingTimeMillis)){
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
   * Handle updating the timer and indicate when time's up
   *
   * @param {number} remainingTimeMillis
   * @return {void | remainingTimeMillis}
   */
  function updateTime(remainingTimeMillis) {
    if (remainingTimeMillis <= TIMES_UP_LIMIT_MS) {
      clearTimer();
      timesUp();
    } else if (pause){
      return displayTime='Paused';
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
    displayTime = 'Time\'s up!';
    if (
      'CurrentDriver' in sessionData &&
      'UUID' in sessionData.CurrentDriver
    ) {
      if (uuid === sessionData.CurrentDriver.UUID && !(Number.isInteger(displayTime))) {
        showReset = true;
        const notification = sendDriverNotification(notifySound);
        notification.onclick = () => {
          updateSession(sessionData);
          notification.close();
        };
      } else {
        sendNotification(notifySound);
      }
    }
  }

  /**
   * Clear the set Intervals responsible for displaying the timer
   */
  function clearTimer() {
    intervals.forEach(interval => clearInterval(interval));
    intervals = [  ];
  }

  /**
   * handle updates to the session duration
   * @param {object} e - event
   */
  function changeSessionDuration(e) {
    const validateResult = validateInput(e.target.value, MAX_DURATION_LIMIT);
    if (!isNaN(validateResult)) {
      invalidInput = false;
      sessionData.UpdatedDuration = minsToMillis(validateResult);
    } else {
      invalidInput = true;
      e.target.value = millisToMinutesAndSeconds(sessionData.Duration);
      message = validateResult;
    }
  }
</script>
<TimerSVG
  duration={sessionData.Duration}
  startTimestamp={sessionData.StartTime}
  displayTime={displayTime}
  degrees={360 / sessionData.Duration}
  bind:pause
/>


<div class="reset-container">
  {#if showReset}
  <input
  type="number"
  min="0"
  max={MAX_DURATION_LIMIT}
  on:change={changeSessionDuration}
  bind:value={updatedDuration}
  placeholder={millisToMinutesAndSeconds(sessionData.Duration)}
  class="reset-input"
  >
  <button class="reset-button" on:click={() => updateSession(sessionData)}>
    <img class="reset-img" data-testid="reset-svg" src="/reset-timer.svg" alt="reset the timer" />
  </button>
  {:else}
  <button class="pause-button" on:click={() => handlePause()}>
    <img class="pause-img" data-testid="pause-svg" src="/pause.svg" alt="pause button"/>
  </button>
{/if}
</div>


<style>
  .reset-container {
    display: flex;
    flex-flow: column wrap;
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 50%;
    justify-content: center;
    align-items: center;
    width: 20vw;
  }

  .reset-input {
    text-align: center;
    background-color: Transparent;
    border: none;
    outline:none;
    background: transparent;
    font-size: 2rem;
    color: #993299;
    z-index: 99;
    border-bottom: solid #993299;
  }

  .reset-button, .pause-button {
    background-color: Transparent;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow: hidden;
    outline:none;
    border-radius: 50%;
  }

  .reset-img, .pause-img {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    width: 15%;
  }

</style>
