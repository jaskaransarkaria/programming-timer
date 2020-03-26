<script>
  const m = {
    x: 0,
    y: 0,
  };

  function handleMousemove({ clientX, clientY }) {
    m.x = clientX;
    m.y = clientY;
  }
</script>

<div on:mousemove={handleMousemove}>
  The mouse position is {m.x} x {m.y}
</div>

<style>
  div {
        width: 300px;
        height: 300px;
        color: purple;
        background: lightseagreen;
    }
</style>
