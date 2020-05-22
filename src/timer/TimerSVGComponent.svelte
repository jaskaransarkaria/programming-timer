<script>
import moment from 'moment';


// [X] remove all extraneous parts (text timer)
// [] turn revolutions into 1hr blocks
// [] easy access to props for colour
// [] pass down session data and parse it properly

  export let outerColor;
  export let innerColor;
  export let countdownColor;
  export let displayCountdown;
  export let timerDuration;
  export let resetTimerRequested;
  export let resetTimer;
  export let timerCount;
  export let completeTimer;
  // State variables
  let draw = null;
  let timerIsRunning = false;
  let timerisReset = false;
  let counterText;
  let duration = 0;
  let elapsedTime = 0;
  let startDateMoment = null;
  // Instance variables
  const goalTimeMilliseconds = timerCount * 1000;
  const degrees = 360 / (timerCount * 1000);

  // useInterval(() => {
  //   if (resetTimerRequested) {
  //     reset();
  //   }
  // }, resetTimerRequested);

  setInterval(() => {
    // Moments are used to correct drift from JavaScript's setInterval
    duration = elapsedTime + moment(new Date()).diff(moment(startDateMoment));
    if (duration <= goalTimeMilliseconds) {
      draw = drawCoord(duration * degrees);
    } else {
      completeTimer(true);
      draw = drawCoord(359.99);
    }
    // Inform the parent component of the current timer duration
    if (timerDuration) timerDuration(duration);
  }, 500);

  const start = () => {
    if (!timerisReset) {
      elapsedTime = duration;
    }
    startDateMoment = moment(new Date());
    timerIsRunning = true;
  };

  const pause = () => {
    timerIsRunning = false;
  };

  const reset = () => {
    timerIsRunning = false;
    timerisReset = true;
    duration = 0;
    elapsedTime = 0;
    draw = drawCoord(360);
    // Call the callback functions on the parent component
    if (completeTimer) completeTimer(false);
    if (resetTimer) resetTimer();
  };

  // Wizardry - for which credit must go to the source: https://jsfiddle.net/prafuitu/xRmGV/
  const drawCoord = degrees => {
    let radius = 60;
    let radians = (degrees * Math.PI) / 180;
    let offset = 10;
    let rX = radius + offset + Math.sin(radians) * radius;
    let rY = radius + offset - Math.cos(radians) * radius;
    let dir = degrees > 180 ? 1 : 0;
    // prettier-ignore
    let coord = 'M' + (radius + offset) + ',' + (radius + offset) + ' ' + 'L' + (radius + offset) + ',' + offset + ' ' + 'A' + radius + ',' + radius + ' 0 ' + dir + ',1 ' + rX + ',' + rY
    return coord;
  };
</script>
