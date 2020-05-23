<script>
  export let duration = 0; // number of seconds the timer will run for
  export let startTimestamp;
  let draw = null;
  let elapsedMilis = 0;
  const degrees = 360 / duration;

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
    (radius + offset) +
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
  });
</script>

<svg version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
  viewBox="-210 0 560 175">
  <!-- Outer circle -->
  <circle cx="70" cy="70" r="60.75" fill={'#ffa'} />
  <!-- The black circle that covers the Color as the timer counts down -->
  <path d={draw} fill={'#333'} />
</svg>