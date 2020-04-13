<script>
  'use strict';
  import { onMount } from 'svelte';
  import Timer from './Timer.svelte';
  import Websocket from '../utils/websocket.js';
  import { minsToMillis } from '../utils/utils.js';

  let ws;
  let newTimer = false;
  // eslint-disable-next-line prefer-const
  let existingSession = false;
  let hideInput = false;
  let sessionData = {};

  onMount( () => {
    ws = new Websocket();
  });

  async function submit(e) {
    if (e.keyCode === 13) {
      if (newTimer) {
        const response = await initNewSession(e.target.value);
        Object.assign(sessionData, response);
        sessionData.newTimer = true;
      }
      if (existingSession) {
        await joinExistingSession(e);
      }
      hideInput = true;
    }
  }

  async function initNewSession(duration) {
    newTimer = true;
    const response = await fetch(`http://${process.env.ADDR}/session/new`, {
      method: 'POST',
      body: JSON.stringify({
        duration: parseInt(minsToMillis(duration), 10),
        startTime: Date.now(),
      }),
    });
    return response.json();
  }

  async function joinExistingSession(e) {
    const response = await fetch(`http://${process.env.ADDR}/session/join`, {
      method: 'POST',
      body: JSON.stringify({  joinSession: e.target.value }),
    });
    sessionData = await response.json();
    sessionData.newTimer = false;
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
    data-testid="setup-timer-new-timer-input"
    on:keydown={submit}
    placeholder="enter the timer length in mins" />
{/if}

{#if existingSession && !hideInput}
  <input
    data-testid="setup-timer-join-session-input"
    on:keydown={submit}
    placeholder="enter your session code here" />
{/if}

{#if (newTimer && hideInput) || sessionData && existingSession && hideInput}
  <Timer {ws} {sessionData}/>
{/if}
