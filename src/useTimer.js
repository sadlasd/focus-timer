import { useEffect, useState } from 'react';
import { MODES, remainingSeconds } from './timer';

export default function useTimer() {
  const [mode, setMode] = useState('focus');
  const [seconds, setSeconds] = useState(MODES.focus.seconds);
  const [endTime, setEndTime] = useState(null);
  const [sessions, setSessions] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (endTime === null) return;

    function tick() {
      const remaining = remainingSeconds(endTime, Date.now());
      setSeconds(remaining);
      if (remaining === 0) {
        setEndTime(null);
        if (mode === 'focus') setSessions((count) => count + 1);
        setMessage(mode === 'focus'
          ? 'Сессия завершена. Пора сделать перерыв!'
          : 'Перерыв закончился. Можно вернуться к задаче.');
      }
    }

    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [endTime, mode]);

  function toggle() {
    if (endTime !== null) {
      // Завершение обработает tick, если нажали паузу в последнюю секунду.
      const remaining = remainingSeconds(endTime, Date.now());
      if (remaining === 0) return;
      setSeconds(remaining);
      setEndTime(null);
    } else {
      const duration = seconds || MODES[mode].seconds;
      setSeconds(duration);
      setEndTime(Date.now() + duration * 1000);
      setMessage('');
    }
  }

  function reset() {
    setEndTime(null);
    setSeconds(MODES[mode].seconds);
    setMessage('');
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setEndTime(null);
    setSeconds(MODES[nextMode].seconds);
    setMessage('');
  }

  return { mode, seconds, running: endTime !== null, sessions, message, toggle, reset, changeMode };
}
