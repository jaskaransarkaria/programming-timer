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

<style>

</style>

{#if !newTimer && !existingSession}
  <button
    data-testid="setup-timer-new-timer-button"
    on:click={() => (newTimer = true)}>
    New Timer
  </button>
{/if}

{#if newTimer && !hideInput}
  <input
    autofocus
    data-testid="setup-timer-new-timer-input"
    on:keydown={initNewSession}
    placeholder="enter the timer length in mins" />
{/if}

{#if (newTimer && hideInput) || (sessionData && existingSession && hideInput)}
  <Timer {sessionData} />
{/if}

<h3>Allow notifications so we can alert you when time's up</h3>

{#if typeof input === 'string'}
  <h3>{input}</h3>
{/if}
