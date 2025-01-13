<!-- src/routes/+page.svelte -->
<script>
    import TShirtDesigner from '$lib/components/TShirtDesigner.svelte';
  </script>
  
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">T-Shirt Designer</h1>
      </div>
    </header>
  
    <main class="max-w-7xl mx-auto py-6 px-4">
      <TShirtDesigner />
    </main>
  </div>