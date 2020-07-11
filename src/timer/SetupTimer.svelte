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
  let newTimer = false;
  // eslint-disable-next-line prefer-const
  let existingSession = false;
  let hideInput = false;
  const sessionData = {};

  onMount(async () => {
    const existingSessionPath = initRouter();
    if (existingSessionPath) {
      await joinExistingSession(existingSessionPath.slice(1));
    }
    sessionStorage.clear();
    try {
      checkPermissions();
    } catch (e) {
      console.error('Cannot instantiate Notification constructor');
    }
  });

  async function initNewSession(e) {
    if (e.keyCode === 13) {
      input = validateInput(minsToMillis(e.target.value), minsToMillis(120));
      if (typeof  input === 'number') {
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

<body>
  {#if !newTimer && !existingSession}
    <button
      data-testid="setup-timer-new-timer-button"
      on:click={() => (newTimer = true)}>
      <img src="/new-timer-button.svg" alt="start new timer"/>
    </button>
    <h3>Allow notifications so we can alert you when time's up</h3>
  {/if}

  {#if newTimer && !hideInput}
  <div class="input-container">
    <img class="input-svg" src="/new-timer-input.svg" alt="input timer duration minutes"/>
    <input
    autofocus
    data-testid="setup-timer-new-timer-input"
    on:keydown={initNewSession}
    placeholder="enter duration (mins)"
    required
    />
  </div>
  {/if}

  {#if (newTimer && hideInput) || (sessionData && existingSession && hideInput)}
    <div class="timer-container">
      <Timer {sessionData} />
  </div>
    {/if}
    
    {#if typeof input === 'string'}
      <h3>{input}</h3>
    {/if}
</body>

<style>
  h3 {
    font-family: Kalam-Regular;
    color:  #eeaaffff;
    font-size: 2.5em;
		font-weight: 100;
  }

  button {
    background-color: Transparent;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow: hidden;
    outline:none;
    border-radius: 50%;
  }

  input {
    position: absolute;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);
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

  .input-svg {
    fill: none;
  }

  .timer-container {
    position: absolute;
    height:75%;
    width: 100%;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);
    /* border: blue 2px solid; */
  }
</style>
