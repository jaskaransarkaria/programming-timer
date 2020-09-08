<script>
  'use strict';
  import { onMount } from 'svelte';
  import { checkPermissions } from '../utils/notification.js';
  import Timer from './Timer.svelte';
  import {
    newSession, joinSession,
} from '../utils/handleSession.js';
  import {
    initRouter, redirect,
} from '../router/router.js';
  import {
    validateInput, minsToMillis,
} from '../utils/utils.js';

  let input;
  export let newTimer = false;
  export let existingSession = false;
  let message;
  let invalidInput;
  let hideInput = false;
  let INITIAL_VALUE_MINS = 15;
  
  const sessionData = {};
  const MAX_VALUE_MINS = 120;
  const MIN_VALUE_MINS = 1;

  onMount(async () => {
    sessionStorage.clear();
    const existingSessionPath = initRouter();
    if (existingSessionPath) {
      await joinExistingSession(existingSessionPath.slice(1));
    }
    try {
      checkPermissions();
    } catch (e) {
      console.error('Cannot instantiate Notification constructor');
    }
  });

  async function initNewSession(e) {
    if (e.keyCode === 13) {
      input = validateInput(minsToMillis(e.target.value), minsToMillis(MAX_VALUE_MINS));
      if (typeof input === 'number') {
        try {
          const response = await newSession(e.target.value);
          Object.assign(sessionData, response.Session);
          sessionStorage.setItem('uuid', response.User.UUID);
          redirect(sessionData.SessionID);
        } catch (err) {
          console.error(err);
        }
        sessionData.newTimer = newTimer;
        hideInput = true;
      } else {
        e.target.value = '';
      }
    }
  }

  async function joinExistingSession(sessionId) {
    try {
      const response = await joinSession(sessionId);
      Object.assign(sessionData, response.Session);
      sessionStorage.setItem('uuid', response.User.UUID);
      hideInput = true;
      existingSession = true;
    } catch (err) {
      console.error(err);
    }
  }
</script>

<style>
  h3,
  h2 {
    position: absolute;
    font-family: Kalam-Regular;
    color: #eeaaffff;
    font-size: 1.8em;
    font-weight: 100;
    left: 50%;
    transform: translateX(-50%);
    top: 12.5%;
  }

  .message {
    left: 50%;
    transform: translateX(-50%);
    top: 18%;
  }

  button {
    background-color: Transparent;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;
    outline: none;
    border-radius: 50%;
  }

  input[type="number"] {
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: Transparent;
    border: none;
    width: 25%;
    outline: none;
    background: transparent;
    font-family: Kalam-Bold;
    font-size: 2rem;
    color: #993299;
    z-index: 99;
    border-bottom: solid #993299;
  }

  #range-slider {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
  }

  .input-svg,
  .new-timer-svg {
    fill: none;
    width: 68vh;
  }

  .timer-container {
    position: absolute;
    height: 75%;
    width: 100%;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

{#if !newTimer && !existingSession}
  <h3>Allow notifications so we can alert you when time's up</h3>
  <button
    data-testid="setup-timer-new-timer-button"
    on:click={() => (newTimer = true)}>
    <img
      class="new-timer-svg"
      src="/new-timer-button.svg"
      alt="start new timer" />
  </button>
{/if}

{#if newTimer && !hideInput}
  <div class="input-container">
    <h2>enter duration (mins)</h2>
    <img
      class="input-svg"
      src="/new-timer-input.svg"
      alt="input timer duration minutes" />
      <input
        id="setup-timer-new-timer-input"
        type="number"
        max={MAX_VALUE_MINS}
        min={MIN_VALUE_MINS}
        data-testid="setup-timer-new-timer-input"
        on:keydown={initNewSession}
        placeholder="enter duration (mins)"
        bind:value={INITIAL_VALUE_MINS}
        required />
      <input
        id="range-slider"
        data-testid="range-slider"
        type="range"
        min={MIN_VALUE_MINS}
        max={MAX_VALUE_MINS}
        bind:value={INITIAL_VALUE_MINS} />
    </div>
{/if}

{#if message || invalidInput}
  <h2 class="message">{message}</h2>
{/if}
{#if typeof input === 'string'}
  <h3>{input}</h3>
{/if}

{#if (newTimer && hideInput) || (sessionData && existingSession && hideInput)}
  <div class="timer-container">
    <Timer {sessionData} bind:message bind:invalidInput />
  </div>
{/if}
