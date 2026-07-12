export type WaitForCondition = () => boolean | Promise<boolean>;

export type WaitForOptions = {
  /**
   * Delay between condition checks in milliseconds.
   * @default 100
   */
  interval?: number;
  /**
   * Maximum time to wait for the condition in milliseconds.
   * @default 5000
   */
  timeout?: number;
};

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export function waitFor(milliseconds: number): Promise<void>;
export function waitFor(
  condition: WaitForCondition,
  options?: WaitForOptions,
): Promise<void>;

/**
 * Wait for a duration or until a condition returns true.
 */
export async function waitFor(
  millisecondsOrCondition: number | WaitForCondition,
  options: WaitForOptions = {},
): Promise<void> {
  if (typeof millisecondsOrCondition === 'number') {
    return delay(millisecondsOrCondition);
  }

  const { interval = 100, timeout = 5000 } = options;
  const startTime = Date.now();

  while (true) {
    if (await millisecondsOrCondition()) {
      return;
    }

    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= timeout) {
      throw new Error(
        `Timed out after ${timeout}ms while waiting for condition.`,
      );
    }

    await delay(Math.min(interval, timeout - elapsedTime));
  }
}
