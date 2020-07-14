<script>
  'use strict';
  import { onDestroy } from 'svelte';

  export let duration = 0; // number of seconds the timer will run for
  export let startTimestamp;
  export let displayTime;
  export let degrees = 360 / duration;
  let elapsedMillis = 0;
  let draw = null;

  onDestroy(() => {
    clearInterval(intervalId);
  });

  const drawCoord = (degrees) => {
    const radius = 110;
    const radians = (degrees * Math.PI) / 180;
    const offset = 30;
    const rX = radius + offset + Math.sin(radians) * radius;
    const rY = radius + offset - Math.cos(radians) * radius;
    // eslint-disable-next-line multiline-ternary
    const dir = degrees > 180 ? 1 : 0;
    const coord =
      'M' +
      (radius + offset) +
      ',' +
      offset +
      ' ' +
      'L' +
      (radius + offset) +
      ',' +
      offset +
      ' ' +
      'A' +
      radius +
      ',' +
      radius +
      ' 0 ' +
      dir +
      ',1 ' +
      rX +
      ',' +
      rY;

    return coord;
  };

  const intervalId = setInterval(() => {
    elapsedMillis = Date.now() - startTimestamp;
    if (elapsedMillis <= duration) {
      draw = drawCoord(elapsedMillis * degrees);
    } else {
      draw = drawCoord(359.99);
    }
  }, 30);
</script>

<svg
  data-testid="svg-element-parent"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  viewBox="-210 0 700 270"
>
  >
  <!-- Outer circle -->
  <circle data-testid="svg-outer-circle" cx="140" cy="140" r="120"
  stroke={'#40e0d0'} stroke-width={'5'} fill={'none'} /> <path
  data-testid="svg-path" d={draw} stroke={' #993299'} stroke-width={'3'}
  fill={'none'} />
  <text
    data-testid="svg-text"
    x="140"
    y="130"
    text-anchor="middle"
    class="timer-text"
  >
    {displayTime}
  </text>
</svg>

<style>
  text {
    fill: #993299;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
