import type { Point } from "@/types";

  
  export const isSamePosition = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;
  
  export const hasValue = (key: string, value: any) => (item: any): boolean => item[key] === value;
  
  export const doesNotHaveValue = (key: string, value: any) => (item: any): boolean => item[key] !== value;
  
  export const hasId = (id: number | string) => hasValue('id', id);
  
  export const doesNotHaveId = (id: number | string) => doesNotHaveValue('id', id);
  
  export const hasPosition = <T extends { position: Point }>(position: Point) => (item: T): boolean => isSamePosition(item.position || { x: 0, y: 0 }, position);
  
  export const notStatic = (item: { static?: boolean }): boolean => !item.static;
  