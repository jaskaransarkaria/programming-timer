<script>
  export let user = { loggedIn: false };

  function toggle() {
    user.loggedIn = !user.loggedIn;
  }
</script>


{#if user.loggedIn}
  <button on:click={toggle} data-testid=log-out-button>
    Log Out
  </button>
{:else}
  <button on:click={toggle} data-testid=log-in-button>
    Log In
  </button>
{/if}


<style>
</style>