<script>
  import Timer from './Timer.svelte';
  import { minsToMillis } from '../utils/utils.js';
  'use strict';

  let hideInput = false;
  let newTimer = false;
  let timerLength = 0;

  function hideOnSubmit(e) {
    if (e.keyCode === 13) {
      hideInput = true;
    }
  }

</script>

{#if newTimer && !hideInput}
  <input data-testid="setupTimer-input" bind:value={timerLength} on:keydown={hideOnSubmit}>
{/if}

{#if !newTimer}
  <button data-testid="setupTimer-newTimerButton" on:click={() => newTimer = true}>New Timer</button>
{/if}

{#if timerLength > 0}
  <Timer data-testid="setupTimer-timer" durationMins={minsToMillis(timerLength)} />
{/if}

<style>
</style>

