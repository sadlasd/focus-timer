export const MODES = {
  focus: { label: 'Фокус', seconds: 25 * 60 },
  short: { label: 'Перерыв', seconds: 5 * 60 },
  long: { label: 'Длинный перерыв', seconds: 15 * 60 },
};

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

// Считаем время от конца сессии: фоновая вкладка может замедлять setInterval.
export function remainingSeconds(endTime, now) {
  return Math.max(0, Math.ceil((endTime - now) / 1000));
}
