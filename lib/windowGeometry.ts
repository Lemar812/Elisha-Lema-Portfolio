import type { Position } from "./windowStore";
export function fitWindow(position: Position, width: number, height: number, areaWidth: number, areaHeight: number) {
  const w = Math.min(width, Math.max(0, areaWidth));
  const h = Math.min(height, Math.max(0, areaHeight));
  return { width: w, height: h, x: Math.max(0, Math.min(position.x, areaWidth - w)), y: Math.max(0, Math.min(position.y, areaHeight - h)) };
}
