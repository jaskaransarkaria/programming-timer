<script>
  import Greeting from './Greeting.svelte';
  import Login from './Login.svelte';
  import FrameworkList from './FrameworkList.svelte';
  import EventDemo from './EventDemo.svelte';
  import BindingDemo from './BindingDemo.svelte';
  import SetupTimer from './timer/SetupTimer.svelte';
  
  export let name;
</script>

<main>
	<h1>Hello {name}!</h1>
  <SetupTimer/>
  <Greeting/>
  <Login />
  <FrameworkList />
  <EventDemo/>
  <BindingDemo />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
