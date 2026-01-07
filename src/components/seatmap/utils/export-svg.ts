import { EditorElement, Bounds } from './types';

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Calculate the bounding box of all elements
 */
function calculateBounds(elements: EditorElement[]): Bounds {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    const width = el.type === 'rect' ? el.width : 100;
    const height = el.type === 'rect' ? el.height : el.fontSize * 1.5;

    // Simple bounds calculation (doesn't account for rotation)
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + width);
    maxY = Math.max(maxY, el.y + height);
  });

  // Add padding
  const padding = 20;
  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

/**
 * Convert element rotation to SVG transform
 */
function getTransform(el: EditorElement): string {
  if (el.rotation === 0) return '';

  const width = el.type === 'rect' ? el.width : 0;
  const height = el.type === 'rect' ? el.height : 0;
  const cx = el.x + width / 2;
  const cy = el.y + height / 2;

  return ` transform="rotate(${el.rotation} ${cx} ${cy})"`;
}

/**
 * Convert scene graph to clean SVG string
 */
export function exportToSVG(elements: EditorElement[]): string {
  if (elements.length === 0) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';
  }

  const bounds = calculateBounds(elements);

  const svgElements = elements
    .map((el) => {
      if (el.type === 'rect') {
        const rectSvg = `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"${getTransform(el)}/>`;
        
        // Add centered label if present
        if (el.label) {
          const fontSize = el.labelFontSize || 14;
          const labelColor = el.labelColor || '#333333';
          const centerX = el.x + el.width / 2;
          const centerY = el.y + el.height / 2 + fontSize * 0.35; // Adjust for baseline
          const labelSvg = `<text x="${centerX}" y="${centerY}" font-size="${fontSize}" font-family="Outfit, sans-serif" fill="${labelColor}" text-anchor="middle"${getTransform(el)}>${escapeXml(el.label)}</text>`;
          return `  <g>\n    ${rectSvg}\n    ${labelSvg}\n  </g>`;
        }
        
        return `  ${rectSvg}`;
      }

      if (el.type === 'text') {
        // SVG text y is baseline, adjust for proper positioning
        const adjustedY = el.y + el.fontSize * 0.85;
        return `  <text x="${el.x}" y="${adjustedY}" font-size="${el.fontSize}" font-family="${el.fontFamily}" fill="${el.fill}"${getTransform(el)}>${escapeXml(el.text)}</text>`;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}">
${svgElements}
</svg>`;
}

/**
 * Trigger download of SVG file
 */
export function downloadSVG(elements: EditorElement[], filename = 'seatmap.svg'): void {
  const svgContent = exportToSVG(elements);
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

