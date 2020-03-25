<script>
  'use strict';

  export let firstName = "Jasky";
  export let lastName = "Coderson";

  $: fullName = `${firstName} ${lastName}`;
</script>

<main>
  <h2>HELLOOOO {fullName} AGAIN</h2>
</main>

<style>
h2 { 
    color: purple;
    font-family: 'Comic Sans MS';
    font-size: 2em;
    }
</style>