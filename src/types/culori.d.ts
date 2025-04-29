declare module 'culori' {
  export function parse(color: string): any
  export function oklch(color: any): { l: number; c: number; h: number }
  export function formatHex(color: any): string
}
