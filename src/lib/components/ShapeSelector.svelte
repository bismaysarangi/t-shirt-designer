<script>
    import { drawingStore } from '../stores/drawingStore';
  
    const tools = ['pencil', 'rectangle', 'circle', 'text'];
</script>
  
<div class="flex gap-2 p-2">
    {#each tools as tool}
      <button
        class="px-4 py-2 rounded {$drawingStore.currentTool === tool ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
        on:click={() => $drawingStore.currentTool = tool}
      >
        {tool}
      </button>
    {/each}
</div>