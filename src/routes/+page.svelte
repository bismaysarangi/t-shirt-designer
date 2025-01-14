<!-- src/routes/+page.svelte -->
<script>
    import Canvas from '$lib/components/Canvas.svelte';
    import Toolbar from '$lib/components/Toolbar.svelte';
  </script>
  
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold mb-8 text-center">Simple Paint App</h1>
    
    <div class="max-w-5xl mx-auto flex gap-8">
      <Toolbar />
      <div class="flex-1">
        <Canvas />
      </div>
    </div>
  </div>
  
