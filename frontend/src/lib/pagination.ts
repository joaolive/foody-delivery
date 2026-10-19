export type PageResult<T> = {
  content: T[];
  number: number;
  last: boolean;
  totalElements: number;
};
