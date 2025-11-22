function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function calculateTotalTime(program) {
  return program.warmup + (program.workTime + program.restTime) * program.cycles + program.cooldown;
}

test('formatTime should format seconds correctly', () => {
  expect(formatTime(65)).toBe('01:05');
  expect(formatTime(5)).toBe('00:05');
  expect(formatTime(0)).toBe('00:00');
});

test('calculateTotalTime should calculate total workout time', () => {
  const program = {
    workTime: 20,
    restTime: 10, 
    cycles: 8,
    warmup: 30,
    cooldown: 30
  };
  expect(calculateTotalTime(program)).toBe(300);
});