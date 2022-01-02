
<script>
  'use strict';
  import { onMount } from 'svelte';
  import {
    newDriverNotification,
  sendDriverNotification,
  sendNotification,
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
    unpauseSession,
} from '../utils/handleSession.js';
  import TimerSVG from './TimerSVG.svelte';
  import { calculateRemainingTime } from '../utils/timer-utils.js'
    
  const notifySound = new Audio('/deduction.mp3');
  const MAX_DURATION_LIMIT = minsToMillis(120);
  const TIMER_REFRESH_RATE_MS = 50;
  const TIMES_UP_LIMIT_MS = TIMER_REFRESH_RATE_MS * 2;
  let intervals = [];

  // sound needs to stored in var here so they can be accessed when the tab is inactive
  const newDriverSound = new Audio('/open-ended.mp3');

  export let sessionData = {};
  let showReset = false;
  export let invalidInput = false;
  export let message = '';
  let ws;
  const uuid = sessionStorage.getItem('uuid');
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
    console.log({event})
    showReset = false;
    //clearTimer();
    try {
      const dataReceived = JSON.parse(event.data);
      if (dataReceived.CurrentDriver){
        sessionData = dataReceived;
        endTime = sessionData.EndTime
        if (sessionData.CurrentDriver.UUID === uuid) {
          newDriverNotification(newDriverSound);
          message = 'You are the driver!';
          } else {
            message = '';
          }
          await calculateRemainingTime(sessionData);
    } else if (dataReceived.PauseTime){
        sessionData = {...sessionData, ...dataReceived}
        console.log("PAUSED", sessionData)
      } else if (dataReceived.UnpauseTime){
        pause = false
        startTimer(sessionData.Duration - (dataReceived.UnpauseTime - sessionData.StartTime), sessionData.EndTime);
        sessionData = {...sessionData, StartTime: sessionData.StartTime + (dataReceived.UnpauseTime - sessionData.StartTime), EndTime: sessionData.EndTime + (dataReceived.UnpauseTime - sessionData.PauseTime), ...dataReceived}
        console.log("RESUME", sessionData)
        console.log("RESUME2", sessionData.StartTime + (dataReceived.UnpauseTime - sessionData.StartTime))
      }
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
      startTimer(sessionData.Duration, sessionData.EndTime);
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
 * Start and display the timer
 * when a new session is created
 *
 * @param {number} duration - MS
 */
export function startTimer(duration, endtime) {
  return display(duration, endtime);
}

/**
 * Continously refresh the timer display
 * for the duration of the timer, unless timer is paused
 *
 * @param {number} remainingTimeMillis
 * @param {number} endtime
 */
function display(remainingTimeMillis, endTime) {
  if (isNaN(remainingTimeMillis)) {
    return remainingTimeMillis;
  } else {
    const currentInterval = setInterval(() => {
      if (!isNaN(remainingTimeMillis)) {
        remainingTimeMillis = updateTime(endTime - Date.now());
        displayTime = millisToMinutesAndSeconds(remainingTimeMillis);
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
    displayTime = timesUp(uuid, sessionData);
  } else {
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
  export function clearTimer() {
    intervals.forEach(interval => clearInterval(interval));
      intervals = [  ];
      console.log("clearing")
  }

/**
 *
 * Handle pause button, starts a new pause timer for duration of pause
 */
function handlePause(pausedState) {
  if (pausedState === true) {
    clearTimer();
    unpauseSession(sessionData.SessionID, Date.now());
    pause = false
    return
  }
  clearTimer();
  pause = true
    // need remaining millis seconds and an interval to keep track of \
    // it and assign it to StartTime
    const currentInterval = setInterval(() => {
      // const remainingTimeMillis = sessionData.EndTime + Date.now();
      sessionData.EndTime += TIMER_REFRESH_RATE_MS
      sessionData.StartTime += TIMER_REFRESH_RATE_MS
      //displayTime = millisToMinutesAndSeconds(remainingTimeMillis)
    }, TIMER_REFRESH_RATE_MS);
    intervals.push(currentInterval)
    // http POST to server
  pauseSession(sessionData.SessionID, Date.now());
  return
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
  bind:startTimestamp={sessionData.StartTime}
  bind:displayTime
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
  <button class="pause-button" on:click={() => handlePause(pause)}>
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
