import { pipe } from 'ramda';
import { tapLog, log, logStart, logFinish, logReceived, logSent, logError } from '../../services/logService';

test('logService log()', () => {
  const consoleSpy = jest.spyOn(console, 'log');
  log('value');
  expect(consoleSpy).toHaveBeenCalledWith('[log]:', 'value');
});

test('logService tapLog()', () => {
  const consoleSpy = jest.spyOn(console, 'log');
  const myPipe = pipe(
    (x: number) => x + 1,
    (x: number) => tapLog(x),
    (x: number) => x * 2
  );

  const a = myPipe(10);
  expect(a).toBe(22);
  expect(consoleSpy).toHaveBeenCalledWith('[tap-log]:', 11);
});

test('logService all colors', () => {
  logStart('started');
  logFinish('finished');
  logReceived('received');
  logSent('sent');
  logError('error');
});
