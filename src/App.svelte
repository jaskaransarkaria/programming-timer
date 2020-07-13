<script>
  import SetupTimer from './timer/SetupTimer.svelte';
  let existingSession;
  let newTimer;

  function redirectHome() {
    location.href = `${process.env.HOME_URL}`;
  }
</script>

<main>
  <div class="header">
    {#if newTimer || existingSession }
    <button class="back-button" on:click={redirectHome}>
        <img src="/back-button.svg" alt="return to main page">
    </button>
    {/if}
    <h1>pair programming timer</h1>
  </div>
  <SetupTimer bind:newTimer bind:existingSession />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
	}

	h1 {
    font-family: Kalam-Bold;
		color: #eeaaffff;
		font-size: 4em;
		font-weight: 100;
  }
  


  .back-button {
    position: absolute;
    left: 2.5%;
    top: 7.5%;
    background-color: Transparent;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow: hidden;
    outline:none;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
