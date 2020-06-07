<script>
  'use strict';
  import { onDestroy } from 'svelte';

  export let duration = 0; // number of seconds the timer will run for
  export let startTimestamp;
  export let displayTime;
  let draw = null;
  let elapsedMilis = 0;
  const degrees = 360 / duration;

  onDestroy(() => {
    clearInterval(intervalId);
  });

  const drawCoord = degrees => {
    const radius = 60;
    const radians = (degrees * Math.PI) / 180;
    const offset = 10;
    const rX = radius + offset + Math.sin(radians) * radius;
    const rY = radius + offset - Math.cos(radians) * radius;
    const dir = degrees > 180 ?
      1 :
      0;
    const coord = 'M' +
    (radius + offset) +
    ',' +
    (offset) +
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
    elapsedMilis = Date.now() - startTimestamp;
    if (elapsedMilis <= duration) {
      draw = drawCoord(elapsedMilis * degrees);
    } else {
      draw = drawCoord(359.99);
      clearInterval(intervalId);
    }
  }, 30);
</script>

<svg version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
  viewBox="-210 0 560 175">
  <!-- Outer circle -->
  <circle cx="70" cy="70" r="64"  stroke={'#40e0d0'} stroke-width={'2'} fill={'none'} /> 
  <!-- The black circle that covers the Color as the timer counts down -->
  <path d={draw} stroke={' #993299'} stroke-width={'3'} fill={'none'} />
  <style  ></style>
  <text x=70 y=70 text-anchor='middle' class='italic' >
    {displayTime}
  </text>
</svg>
