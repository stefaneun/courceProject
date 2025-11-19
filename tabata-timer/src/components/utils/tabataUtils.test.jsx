import { formatTime, calculateTotalTime } from './tabataUtils';

describe('Tabata Utilities', () => {
  test('formatTime correctly formats seconds', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(0)).toBe('00:00');
  });

  test('calculateTotalTime calculates correct duration', () => {
    const program = {
      workTime: 20,
      restTime: 10,
      cycles: 8,
      warmup: 30,
      cooldown: 30
    };
    expect(calculateTotalTime(program)).toBe(280);
  });
});