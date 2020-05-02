<script>
  'use strict';
  import { onMount } from 'svelte';
  import Timer from './Timer.svelte';
  import {
    newSession, joinSession,
} from '../utils/handleSession.js';

  let newTimer = false;
  // eslint-disable-next-line prefer-const
  let existingSession = false;
  let hideInput = false;
  const sessionData = {};

  onMount( () => {
    sessionStorage.clear();
  });

  async function submit(e) {
    if (e.keyCode === 13) {
      if (newTimer) {
        await initNewSession(e.target.value);
      }
      if (existingSession) {
        await joinExistingSession(e.target.value);
      }
      sessionData.newTimer = newTimer;
      hideInput = true;
    }
  }

  async function initNewSession(duration) {
    try {
      const response = await newSession(duration);
      Object.assign(sessionData, response.Session);
      sessionStorage.setItem('uuid', response.User.UUID);
    } catch (err) {
      console.error(err);
    }
  }
  
  async function joinExistingSession(sessionId) {
    try {
      const response = await joinSession(sessionId);
      Object.assign(sessionData, response.Session);
      sessionStorage.setItem('uuid', response.User.UUID);
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
  on:click={() => newTimer = true}>
    New Timer
</button>

  <button
    data-testid="setup-timer-existing-session-button"
    on:click={() => existingSession = true}>
    Join Session
  </button>
{/if}

{#if newTimer && !hideInput}
  <input 
    autofocus
    data-testid="setup-timer-new-timer-input"
    on:keydown={submit}
    placeholder="enter the timer length in mins" />
{/if}

{#if existingSession && !hideInput}
  <input
    autofocus
    data-testid="setup-timer-join-session-input"
    on:keydown={submit}
    placeholder="enter your session code here" />
{/if}

{#if (newTimer && hideInput) || sessionData && existingSession && hideInput}
  <Timer {sessionData} />
{/if}
