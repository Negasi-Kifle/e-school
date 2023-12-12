export {};

declare global {
  interface RequestQuery {
    fields?: string;
    sort?: string;
    page?: number;
    limit?: number;
    [key: string]: any;
  }
}
