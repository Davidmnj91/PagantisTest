export type Optional<T> = T | null;

export const hasValues = (o: Record<any, any>): boolean => !!o && Object.keys(o).length > 0;
