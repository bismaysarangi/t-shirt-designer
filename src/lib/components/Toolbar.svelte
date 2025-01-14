<script>
    import ColorPicker from './ColorPicker.svelte';
    import ShapeSelector from './ShapeSelector.svelte';
    import { drawingStore, undo, redo } from '../stores/drawingStore';
  </script>
  
  <div class="flex flex-col gap-4 p-4 bg-gray-100">
    <ShapeSelector />
    <ColorPicker />
    
    <div class="flex gap-2">
      <label class="flex items-center gap-2">
        Stroke Width:
        <input
          type="range"
          min="1"
          max="20"
          bind:value={$drawingStore.strokeWidth}
          class="w-32"
        />
      </label>
    </div>
  
  </div>