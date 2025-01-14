<script>
  import { onMount } from 'svelte';
  import { drawingStore, addShape } from '../stores/drawingStore';

  let canvas;
  let ctx;
  let drawing = false;
  let currentShape = null;

  // SVG T-shirt template URL
  const svgTemplateURL = '/tshirt-template.svg';

  let svgImage;

  $: canvasStyle = `
    width: 600px;
    height: 600px;
    cursor: ${$drawingStore.currentTool === 'text' ? 'text' : 'crosshair'}
  `;

  // Load the SVG as an image
  onMount(() => {
    ctx = canvas.getContext('2d');
    svgImage = new Image();
    svgImage.src = svgTemplateURL;

    svgImage.onload = () => {
      drawCanvas();
    };
  });

  // Draw canvas and SVG
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw SVG template as background
    if (svgImage) {
      ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw all stored shapes
    $drawingStore.shapes.forEach(shape => {
      drawShape(shape);
    });
  }

  function drawShape(shape) {
    ctx.beginPath();
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;
    ctx.fillStyle = shape.color;

    switch (shape.type) {
      case 'pencil':
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        shape.points.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        break;

      case 'rectangle':
        ctx.strokeRect(
          shape.startX,
          shape.startY,
          shape.width,
          shape.height
        );
        break;

      case 'circle':
        ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        break;

      case 'text':
        ctx.font = `${shape.fontSize}px Arial`;
        ctx.fillText(shape.text, shape.x, shape.y);
        break;
    }
  }

  // Event handlers (same as before)
  function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawing = true;

    if ($drawingStore.currentTool === 'text') {
      const text = prompt('Enter text:', '');
      if (text) {
        addShape({
          type: 'text',
          x,
          y,
          text,
          color: $drawingStore.currentColor,
          fontSize: $drawingStore.fontSize
        });
        drawCanvas();
      }
      return;
    }

    currentShape = {
      type: $drawingStore.currentTool,
      color: $drawingStore.currentColor,
      strokeWidth: $drawingStore.strokeWidth,
      points: [{ x, y }],
      startX: x,
      startY: y
    };
  }

  function handleMouseMove(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if ($drawingStore.currentTool === 'pencil') {
      currentShape.points.push({ x, y });
      drawCanvas();
      drawShape(currentShape);
    } else {
      drawCanvas();
      if ($drawingStore.currentTool === 'rectangle') {
        ctx.beginPath();
        ctx.strokeStyle = currentShape.color;
        ctx.lineWidth = currentShape.strokeWidth;
        ctx.strokeRect(
          currentShape.startX,
          currentShape.startY,
          x - currentShape.startX,
          y - currentShape.startY
        );
      } else if ($drawingStore.currentTool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - currentShape.startX, 2) +
          Math.pow(y - currentShape.startY, 2)
        );
        ctx.beginPath();
        ctx.strokeStyle = currentShape.color;
        ctx.lineWidth = currentShape.strokeWidth;
        ctx.arc(currentShape.startX, currentShape.startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function handleMouseUp() {
    if (!drawing) return;
    drawing = false;

    if (currentShape && $drawingStore.currentTool !== 'text') {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if ($drawingStore.currentTool === 'rectangle') {
        currentShape.width = x - currentShape.startX;
        currentShape.height = y - currentShape.startY;
      } else if ($drawingStore.currentTool === 'circle') {
        currentShape.radius = Math.sqrt(
          Math.pow(x - currentShape.startX, 2) +
          Math.pow(y - currentShape.startY, 2)
        );
        currentShape.centerX = currentShape.startX;
        currentShape.centerY = currentShape.startY;
      }

      addShape(currentShape);
      currentShape = null;
    }
  }
</script>

<canvas
  bind:this={canvas}
  width="600"
  height="600"
  style={canvasStyle}
  class="border border-gray-300 bg-white"
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
></canvas>
