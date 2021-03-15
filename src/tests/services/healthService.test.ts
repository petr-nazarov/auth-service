import { getHealthStatus } from '../../services/healthService';
import TypeError from '../../errors/TypeError';
test('healthService getHealthStatus()', () => {
  const success = getHealthStatus('success');
  const empty = getHealthStatus(null);
  expect(success.str).toBe('success');
  expect(empty.str).toBe('Empty string');
  expect(() => {
    getHealthStatus('error');
  }).toThrow(TypeError);
});
