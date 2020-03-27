<script>
  'use strict';

  export let firstName = 'Jasky';
  export let lastName = 'Coderson';

  $: fullName = `${firstName} ${lastName}`;
</script>

<h2 data-testId="greeting-header">HELLOOOO {fullName} AGAIN</h2>

<style>
h2 { 
    color: purple;
    font-family: 'Comic Sans MS';
    font-size: 2em;
    }
</style>
