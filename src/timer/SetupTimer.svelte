<script>
  'use strict';
  import { onMount } from 'svelte';
  import Timer from './Timer.svelte';
  import {  minsToMillis } from '../utils/utils.js';
  import {
    initWebsocket,
    sendAndListenToExistingSession,
  } from '../utils/websocket.js';
  
  let ws;
  let newTimer = false;
  let existingSession = false;
  let hideInput = false;
  let timerLength;
  let existingSessionData;

  onMount(async () => {
    ws = await initWebsocket(process.env.addr);
  });

  function hideOnSubmit(e) {
    if (e.keyCode === 13) {
      hideInput = true;
      return;
    }
    return;
  }
  
  function initNewTimer() {
    newTimer = true;
    return;
  }

  function joinExistingSession(e) {
    existingSession = true;
    sendAndListenToExistingSession(ws, e.target.value);
  }
</script>

{#if !newTimer && !existingSession}
  <button 
    data-testid="setup-timer-new-timer-button"
    on:click={initNewTimer}>
      New Timer
  </button>

  <button 
    data-testid="setup-timer-existing-session-button"
    on:click={joinExistingSession}>
      Join Session
  </button>
{/if}

{#if newTimer && !hideInput}
  <input
    data-testid="setup-timer-new-timer-input" 
    bind:value={timerLength}
    on:keydown={hideOnSubmit} 
    placeholder="enter the timer length in mins"
  />
{/if}

{#if existingSession && !hideInput}
  <input 
    data-testid="setup-timer-join-session-input"
    on:keydown={hideOnSubmit} 
    placeholder="enter your session code here"
  />
{/if}

{#if timerLength > 0 && newTimer && hideInput || existingSessionData}
  <Timer 
    ws={ws} 
    durationMins={minsToMillis(timerLength)}
    existingSessionData={existingSessionData}
  />
{/if}

<style>
</style>

