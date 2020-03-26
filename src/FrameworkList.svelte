<script>
  export let frameworks = [
    {
      id: 1,
      name: 'Svetle',
    },
    {
      id: 2,
      name: 'Angular',
    },
    {
      id: 3,
      name: 'React',
    },
    {
      id: 4,
      name: 'Vue',
    },
  ];
</script>

<h1>List Frameworks</h1>
<ul data-testid='framework-ul'>
    {#each frameworks as { id, name }}
      <li>
        { id } : { name }
      </li>
    {/each}
</ul>
