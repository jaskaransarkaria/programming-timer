<script>
  import SetupTimer from './timer/SetupTimer.svelte';
</script>

<main>
  <h1>pair programming timer</h1>
  <SetupTimer/>
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
    background-color: #f6d5ffff;
	}

	h1 {
    font-family: Kalam-Bold;
		color: #eeaaffff;
		/* text-transform: uppercase; */
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
