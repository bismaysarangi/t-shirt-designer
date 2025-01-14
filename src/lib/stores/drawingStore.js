// src/lib/stores/drawingStore.js
import { writable } from 'svelte/store';

export const drawingStore = writable({
  currentTool: 'Pencil', // pencil, rectangle, circle, text
  currentColor: '#000000',
  strokeWidth: 2,
  shapes: [], // Store all shapes drawn
  isDrawing: false,
  startPos: { x: 0, y: 0 },
  currentText: '',
  fontSize: 16
});

export const undoHistory = writable([]);
export const redoHistory = writable([]);

export function addShape(shape) {
  drawingStore.update(state => {
    const newShapes = [...state.shapes, shape];
    undoHistory.update(history => [...history, state.shapes]);
    redoHistory.update(() => []);
    return { ...state, shapes: newShapes };
  });
}

export function undo() {
  drawingStore.update(state => {
    if (state.shapes.length === 0) return state;
    
    const previousShapes = undoHistory.pop();
    redoHistory.update(history => [...history, state.shapes]);
    return { ...state, shapes: previousShapes };
  });
}

export function redo() {
  drawingStore.update(state => {
    const nextShapes = redoHistory.pop();
    if (!nextShapes) return state;
    
    undoHistory.update(history => [...history, state.shapes]);
    return { ...state, shapes: nextShapes };
  });
}