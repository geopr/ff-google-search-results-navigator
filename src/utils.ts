export function applyFocusStyle(e: FocusEvent): void {
  (<HTMLAnchorElement>e.target).style.outline = 'rgb(189, 193, 198) auto 1px'
}

export function applyBlurStyle(e: FocusEvent): void {
  (<HTMLAnchorElement>e.target).style.outline = '0';
}

export function matchChildren({ children }: HTMLAnchorElement): boolean {
  return (
    children.length >= 2 && 
    isBr(children.item(0)!) &&
    isH(children.item(1)!)
  );

  function isBr(el: Element): boolean {
    return el.tagName === 'BR';
  }

  function isH(el: Element): boolean {
    return /^H\d$/.test(el.tagName);
  }
}

export function isVisible(el: HTMLAnchorElement): boolean {
  let parent: Element | null = el;

  while (parent != null) {
    const { display } = window.getComputedStyle(parent);

    if (display === 'none') return false;

    parent = parent.parentElement;
  }

  return true;
}

export function matchKeys(e: KeyboardEvent): boolean {
  return e.altKey && e.shiftKey && /^Bracket(Left|Right)$/.test(e.code);
}

export function cursorComputerFactory(resultLinks: HTMLAnchorElement[]): (e: KeyboardEvent) => number {
  const 
    min = 0,
    max = resultLinks.length - 1,

    start = min - 1,
    end = max + 1;

  let cursor = start;

  return e => {
    const
      isGoingForward = e.code === 'BracketRight',
      cycledCursor = cycleCursor(isGoingForward),
      nextCursor = computeNextCursor(cycledCursor, isGoingForward);

    return (cursor = normalizeCursor(nextCursor));
  }

  function cycleCursor(isGoingForward: boolean): number {
    if (isGoingForward) {
      if (cursor === max) return start;
    } else {
      if (cursor === min) return end;
    }

    return cursor;
  }

  function computeNextCursor(cursor: number, isGoingForward: boolean): number {
    return cursor + (isGoingForward ? 1 : -1);
  }

  function normalizeCursor(cursor: number): number {
    return Math.max(Math.min(cursor, max), min);
  }
}

export function accessByIndex<T>(arr: T[]): (index: number) => T | undefined {
  return index => arr[index];
}

function on<
  E extends keyof HTMLElementEventMap,
>(el: HTMLElement, event: E): AsyncIterableIterator<HTMLElementEventMap[E]> {
  let
    resolve: ((value: HTMLElementEventMap[E]) => void) | null = null,
    promise: Promise<IteratorResult<HTMLElementEventMap[E]>> | null = null,
    isDone: boolean = false;

  el.addEventListener(event, handler);

  return {
    [Symbol.asyncIterator]() {
      return this;
    },

    next() {
      if (isDone) return this.return!();

      return promise ??= createPromsie();

      function createPromsie(): NonNullable<typeof promise> {
        return new Promise(res => {
          resolve = e => {
            res({ done: false, value: e });

            promise = null;
            resolve = null;
          };
        })
      }
    },

    return() {
      const doneChunk: IteratorReturnResult<void> = { done: true, value: undefined };

      if (isDone) return ret();

      isDone = true;

      resolve?.(<any>doneChunk);

      promise = null;
      resolve = null;

      el.removeEventListener(event, <any>handler);

      return ret();

      function ret(): Promise<IteratorReturnResult<void>> {
        return Promise.resolve(doneChunk);
      }
    }
  };

  function handler(e: HTMLElementEventMap[E]): void {
    resolve?.(e);
  }
}

class Iter<T> {
  constructor(protected iterable: AsyncIterable<T>) {
    this.iterable = iterable;
  }

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  filter(cb: (value: T) => boolean): Iter<T> {
    return this.createIter<any>(async function* () {
      for await (const value of this) {
        if (cb(value)) yield value;
      }
    });
  }

  map<R>(cb: (value: T) => R): Iter<R> {
    return this.createIter(async function* () {
      for await (const value of this) {
        yield cb(value);
      }
    });
  }

  protected createIter<R>(gen: (this: Iter<T>) => AsyncIterableIterator<R>): Iter<R> {
    return new Iter(gen.call(this));
  }
}

export function eventStream<
  E extends keyof HTMLElementEventMap,
>(el: HTMLElement, event: E): Iter<HTMLElementEventMap[E]> {
  return new Iter(on(el, event));
}

