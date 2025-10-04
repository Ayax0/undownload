import type { Readable } from "node:stream";

export interface Driver<T extends Readable = Readable> {
  name: string;
  download(offset?: number): Promise<T>;
  size(): Promise<number>;
}
