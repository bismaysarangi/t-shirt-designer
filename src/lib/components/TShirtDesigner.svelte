<!-- src/lib/components/TShirtDesigner.svelte -->
<script>
  import { onMount } from 'svelte';

  let canvasElement;
  let canvas;
  let activeColor = '#000000';
  let activeTool = 'select';
  let fabricInstance;

  onMount(async () => {
    // Dynamic import of fabric
    const fabricModule = await import('fabric');
    fabricInstance = fabricModule.fabric;
    
    canvas = new fabricInstance.Canvas(canvasElement, {
      width: 600,
      height: 800,
      backgroundColor: '#ffffff'
    });

    // Load the t-shirt template
    fabricInstance.loadSVGFromURL('/tshirt-template.svg', function(objects, options) {
      const tshirtObj = fabricInstance.util.groupSVGElements(objects, options);
      tshirtObj.scaleToWidth(500);
      tshirtObj.center();
      canvas.add(tshirtObj);
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  });

  // Basic tool functions
  function setTool(tool) {
    activeTool = tool;
    if (!canvas) return;
    canvas.isDrawingMode = tool === 'draw';
    if (tool === 'draw') {
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = 5;
    }
  }

  async function addText() {
    if (!canvas || !fabricInstance) return;
    
    const text = new fabricInstance.Text('Edit me', {
      left: 200,
      top: 200,
      fontFamily: 'Arial',
      fill: activeColor,
      fontSize: 20
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  }

  async function addShape(type) {
    if (!canvas || !fabricInstance) return;
    
    let shape;
    if (type === 'rect') {
      shape = new fabricInstance.Rect({
        left: 200,
        top: 200,
        fill: activeColor,
        width: 50,
        height: 50
      });
    } else if (type === 'circle') {
      shape = new fabricInstance.Circle({
        left: 200,
        top: 200,
        fill: activeColor,
        radius: 25
      });
    }
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
    }
  }

  function deleteSelected() {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  }

  function updateColor(color) {
    activeColor = color;
    if (!canvas) return;
    
    if (activeTool === 'draw') {
      canvas.freeDrawingBrush.color = color;
    }
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('fill', color);
      canvas.renderAll();
    }
  }
</script>

<div class="max-w-5xl mx-auto p-4">
  <div class="flex gap-4">
    <!-- Tools Panel -->
    <div class="w-48 bg-gray-100 p-4 rounded">
      <h2 class="text-lg font-bold mb-4">Tools</h2>
      <div class="space-y-2">
        <button 
          class="w-full px-4 py-2 rounded {activeTool === 'select' ? 'bg-blue-500 text-white' : 'bg-white'}"
          on:click={() => setTool('select')}
        >
          Select
        </button>
        <button 
          class="w-full px-4 py-2 rounded {activeTool === 'draw' ? 'bg-blue-500 text-white' : 'bg-white'}"
          on:click={() => setTool('draw')}
        >
          Draw
        </button>
        <button 
          class="w-full px-4 py-2 rounded bg-white"
          on:click={addText}
        >
          Add Text
        </button>
        <button 
          class="w-full px-4 py-2 rounded bg-white"
          on:click={() => addShape('rect')}
        >
          Add Rectangle
        </button>
        <button 
          class="w-full px-4 py-2 rounded bg-white"
          on:click={() => addShape('circle')}
        >
          Add Circle
        </button>
        <button 
          class="w-full px-4 py-2 rounded bg-red-500 text-white"
          on:click={deleteSelected}
        >
          Delete Selected
        </button>
        <div class="mt-4">
          <label class="block text-sm font-medium mb-2">Color</label>
          <input 
            type="color" 
            bind:value={activeColor} 
            on:input={() => updateColor(activeColor)}
            class="w-full h-10"
          />
        </div>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="flex-1">
      <canvas
        bind:this={canvasElement}
        class="border border-gray-300 rounded"
      ></canvas>
    </div>
  </div>
</div>