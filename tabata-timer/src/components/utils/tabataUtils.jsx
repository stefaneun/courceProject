export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateTotalTime = (program) => {
  return program.warmup + (program.workTime + program.restTime) * program.cycles + program.cooldown;
};