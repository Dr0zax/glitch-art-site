import { pixel_sort } from './pixel_sort';
import type { SortMode, Direction } from './pixel_sort';

let image = new Image();
image.src = 'images/test.jpg';
const imgInput = document.getElementById('imgInput') as HTMLInputElement;

image.onload = () => {
  if (!canvas || !ctx) {
    console.warn('Canvas or rendering context not available');
    return;
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
}

imgInput.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        image.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
});

const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement;
const directionSelect = document.getElementById('directionSelect') as HTMLSelectElement;
const applyButton = document.getElementById('applyButton') as HTMLButtonElement;
const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;

downloadButton.addEventListener('click', (ev) => {
  ev.preventDefault();

  if (!canvas) {
    console.warn('Canvas not available');
    return;
  }

  const link = document.createElement('a');
  link.download = 'sorted_image.png';
  link.href = canvas.toDataURL();
  link.click();
});

applyButton.addEventListener('click', (ev) => {
  ev.preventDefault();

  if (!canvas || !ctx) {
    console.warn('Canvas or rendering context not available');
    return;
  }

  if (!image.complete || image.naturalWidth === 0) {
    console.warn('Image not loaded yet');
    return;
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const sorted = pixel_sort(imageData, directionSelect.value as Direction, sortSelect.value as SortMode);
  ctx.putImageData(sorted, 0, 0);
});

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

