<script>
  import { drawingStore } from '../stores/drawingStore';

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#808080', '#800000'
  ];
</script>

<div class="flex gap-2 p-2">
  {#each colors as color}
    <button
      class="w-8 h-8 rounded border border-gray-300"
      style="background-color: {color}"
      on:click={() => $drawingStore.currentColor = color}
    ></button>
  {/each}
  <input
    type="color"
    bind:value={$drawingStore.currentColor}
    class="w-8 h-8"
  />
</div>