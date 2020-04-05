<script>
  'use strict';
  import Timer from './Timer.svelte';
  import {  minsToMillis } from '../utils/utils.js';
  import {  initWebsocket } from '../utils/websocket.js';
  let ws;
  let newTimer = false;
  let existingSession = false;
  let hideInput = false;
  let timerLength;
  let existingSessionUid;

  function hideOnSubmit(e) {
    if (e.keyCode === 13) {
      hideInput = true;
    }
    return;
  }
  
  function initNewTimer() {
    newTimer = true;
    ws = initWebsocket(process.env.addr);
    return;
  }

</script>


{#if !newTimer && !existingSession}
  <button data-testid="setup-timer-new-timer-button"
    on:click={initNewTimer}>
    New Timer
  </button>

  <button data-testid="setup-timer-existing-session-button"
    on:click={() => existingSession = true}>
    Join Session
  </button>
{/if}

{#if newTimer && !hideInput}
  <input data-testid="setup-timer-new-timer-input" bind:value={timerLength}
      on:keydown={hideOnSubmit} placeholder="enter the timer length in mins"/>
{/if}

{#if existingSession && !hideInput}
  <input data-testid="setup-timer-join-session-input" bind:value={existingSessionUid}
    on:keydown={hideOnSubmit} placeholder="enter your session code here"/>
{/if}

{#if timerLength > 0}
  <Timer ws={ws} durationMins={minsToMillis(timerLength)} />
{/if}

<style>
</style>

