import { expect, test } from 'rstack/test';
import { waitFor } from '../src/index';

test('should wait for a duration', async () => {
  let completed = false;
  const promise = waitFor(10).then(() => {
    completed = true;
  });

  expect(completed).toBe(false);
  await promise;
  expect(completed).toBe(true);
});

test('should wait for an asynchronous condition', async () => {
  let attempts = 0;

  await waitFor(
    async () => {
      attempts++;
      return attempts === 2;
    },
    { interval: 1 },
  );

  expect(attempts).toBe(2);
});

test('should reject when the condition times out', async () => {
  await expect(
    waitFor(() => false, { interval: 1, timeout: 5 }),
  ).rejects.toThrow('Timed out after 5ms while waiting for condition.');
});
