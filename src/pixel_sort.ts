type SortMode = "brightness" | "red" | "green" | "blue" | "hue";
type Direction = "horizontal" | "vertical";

function pixel_sort(imageData: ImageData, direction: Direction, sortMode: SortMode): ImageData {
  const { width, height, data } = imageData;

  function getPixel(x: number, y: number) : [number, number, number, number] {
    const index = (y * width + x) * 4;
    return [
      data[index],
      data[index + 1],
      data[index + 2],
      data[index + 3]
    ];
  }

  function setPixel(x: number, y: number, rgba: [number, number, number, number]): void {
    const index = (y * width + x) * 4;
    data[index] = rgba[0];
    data[index + 1] = rgba[1];
    data[index + 2] = rgba[2];
    data[index + 3] = rgba[3];
  }

  function computeSortKey(pixel: [number, number, number, number]): number {
    const [r,g,b] = pixel;
    switch (sortMode) {
      case 'brightness':
        return (r + g + b) / 3;
      case 'red':
        return r;
      case 'blue':
        return b;
      case 'green':
        return g;
      case 'hue':
        return rgbToHue(r, g, b);
      default:
        return 0;  // should never happen
        break;
    }
  }

  function rgbToHue(r: number, g:number, b:number): number {
    r /= 255; 
    g /= 255; 
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const delta = max - min;

    if (delta === 0) { return 0; }
    if (delta === r) { return (60 * ((g - b) / delta) + 360) % 360; }
    if (delta === g) { return 60 * ((b - r) / delta) + 120; }
    return 60 * ((r - g) / delta) + 240;
  }

  if (direction === 'horizontal') {
    for (let y = 0; y < height; y++) {
      const row: {pixel: [number, number, number, number], key: number}[] = [];
      for (let x = 0; x < width; x++) {
        const pixel = getPixel(x, y);
        row.push({pixel, key: computeSortKey(pixel)});
      }

      row.sort((a, b) => a.key - b.key);

      for (let x = 0; x < width; x++) {
        setPixel(x, y, row[x].pixel);
      }
    }
  }
  else if (direction === 'vertical') {
    for (let x = 0; x < width; x++) {
      const column: {pixel: [number, number, number, number], key: number}[] = [];
      for (let y = 0; y < height; y++) {
        const pixel = getPixel(x, y);
        column.push({pixel, key: computeSortKey(pixel)});
      }

      column.sort((a, b) => a.key - b.key);

      for (let y = 0; y < height; y++) {
        setPixel(x, y, column[y].pixel);
      }
    }
  }

  return imageData;
}

export { pixel_sort };
export type { SortMode, Direction };