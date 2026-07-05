// Geometry per the research blueprint. Overlap is structurally impossible:
// the window (incl. chrome) ends at y=828; the caption band starts at y=858.
export const SRC = { w: 3688, h: 1772 };           // retina screenshot size
export const CHROME_H = 44;                        // window chrome bar
export const IMG = { w: 1540, h: 740 };            // image viewport inside window (matches SRC aspect)
export const WINDOW = { x: 190, y: 44, w: 1540, h: 740 + 44 }; // -> bottom 828
export const BAND = { x: 130, y: 858, w: 1660, h: 200 };
export const D = IMG.w / SRC.w;                    // base display factor 0.4176

export interface Rect { x: number; y: number; w: number; h: number }
export const WIDE: Rect = { x: 0, y: 0, w: SRC.w, h: SRC.h };

// transform for the image layer (transform-origin 0 0) so `rect` (source px) fills the viewport
export function zoomTo(rect: Rect) {
  const s = Math.min(SRC.w / rect.w, SRC.h / rect.h);
  const cx = (rect.x + rect.w / 2) * D;
  const cy = (rect.y + rect.h / 2) * D;
  return { s, tx: IMG.w / 2 - s * cx, ty: IMG.h / 2 - s * cy };
}

export function lerpRect(a: Rect, b: Rect, p: number): Rect {
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p,
           w: a.w + (b.w - a.w) * p, h: a.h + (b.h - a.h) * p };
}
