'use strict'
<script>
export let duration = 30;
let remainingTime = 'display remaining time';

function timesUp() {
  remainingTime = 'times up!';
  return;
}

function setTimer(duration, timerAlert) {
  setTimeout(() => timerAlert(), duration*1000);
}
</script>

<button data-testid="trigger-timer-button" on:click={() => setTimer(duration, timesUp)} />
<h1 data-testid="timer-header">{remainingTime}</h1>

<style>
</style>
