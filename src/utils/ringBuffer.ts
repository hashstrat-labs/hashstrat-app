/**
 * Ring-Buffer aka Circular-Buffer, Ring-Memory.
 * Note: Extends Array does not work.
 * Use #toArray() for more array operations.
 */

export class RingBuffer<T> {
    private buffer = <any> [];
    private size: number;
  
    constructor(size: number) {
      this.size = size;
    }
  
    public getSize(): number {
      return this.size;
    }
  
    public add(...items: T[]) {
      this.buffer.push(...items);
      this.crop();
    }
  
    public clear() {
      this.buffer = [];
    }
  
    public toArray() {
      return this.buffer.slice();
    }
  
    public fromArray(value: T[]) {
      this.clear();
      this.add(...value);
    }

    public isFull() : boolean {
        return this.buffer.length === this.size
      }
  
    private crop() {
      while (this.buffer.length > this.size) {
        this.buffer.shift();
      }
    }
  }
  