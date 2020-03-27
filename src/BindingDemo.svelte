<script>
  export let name = 'Jasky';
</script>

<input data-testid="input-bind" bind:value={name}/>
<h1 data-testid="header-bind">Jello {name}</h1>
