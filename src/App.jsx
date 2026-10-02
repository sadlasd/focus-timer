import React, { useCallback, useEffect, useState } from 'react';
import TaskList from './TaskList';
import useTimer from './useTimer';
import useWebMcp from './useWebMcp';
import { formatTime, MODES } from './timer';

const STORAGE_KEY = 'focus-tasks-v1';
const exampleTasks = [
  { id: 'read', title: 'Разобраться с useEffect', done: false },
  { id: 'practice', title: 'Сверстать карточку по макету', done: false },
  { id: 'review', title: 'Повторить методы массивов', done: false },
];

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return exampleTasks;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every((task) =>
      task && typeof task.id === 'string' && typeof task.title === 'string' && typeof task.done === 'boolean'
    )) return exampleTasks;
    return parsed;
  } catch {
    return exampleTasks;
  }
}

export default function App() {
  const timer = useTimer();
  const [tasks, setTasks] = useState(readTasks);
  const [activeId, setActiveId] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const activeTask = tasks.find((task) => task.id === activeId && !task.done);
  const doneCount = tasks.filter((task) => task.done).length;
  const progress = (1 - timer.seconds / MODES[timer.mode].seconds) * 100;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [tasks]);

  useEffect(() => {
    document.title = `${formatTime(timer.seconds)} · ${MODES[timer.mode].label} — Фокус`;
    return () => { document.title = 'Фокус'; };
  }, [timer.seconds, timer.mode]);

  const addTask = useCallback((title) => {
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) {
      throw new Error('Название должно содержать от 1 до 120 символов.');
    }
    const task = { id: crypto.randomUUID(), title: title.trim(), done: false };
    setTasks((current) => [...current, task]);
    return task;
  }, []);

  useWebMcp(addTask);

  function toggleTask(id) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
    if (id === activeId) setActiveId(null);
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    if (id === activeId) setActiveId(null);
  }

  return (
    <div className="app">
      <header className="header">
        <a className="brand" href="#main"><img src="/favicon.svg" width="32" height="32" alt="" />Фокус</a>
        <span className="header-caption">По одной задаче за раз</span>
      </header>

      <main id="main">
        <div className="page-heading">
          <h1>Время сосредоточиться</h1>
          <p>25 минут на дело. Потом немного отдыха.</p>
        </div>

        <div className="workspace">
          <section className="timer-panel" aria-label="Таймер">
            <div className="modes" role="group" aria-label="Режим таймера">
              {Object.entries(MODES).map(([key, value]) => (
                <button key={key} type="button" aria-pressed={key === timer.mode}
                  className={key === timer.mode ? 'selected' : ''} onClick={() => timer.changeMode(key)}>
                  {value.label}
                </button>
              ))}
            </div>

            <div className="timer-face">
              <span className="timer-label">{timer.running ? 'Таймер идёт' : timer.seconds === 0 ? 'Готово!' : 'В твоём темпе'}</span>
              <div className="time" role="timer" aria-label={`Осталось ${formatTime(timer.seconds)}`}>{formatTime(timer.seconds)}</div>
              <span className="timer-caption">{timer.mode === 'focus' ? 'Одна задача. Без спешки.' : 'Разомнись и отдохни от экрана.'}</span>
            </div>

            <progress className="timer-progress" value={progress} max="100" aria-label="Прогресс сессии" />
            <div className="timer-actions">
              <button className="primary" type="button" onClick={timer.toggle}>{timer.running ? 'Пауза' : timer.seconds === 0 ? 'Ещё раз' : timer.seconds < MODES[timer.mode].seconds ? 'Продолжить' : 'Начать'}</button>
              <button className="reset" type="button" onClick={timer.reset}>Сбросить</button>
            </div>
            <p className="session-message" role="status">{timer.message || '\u00a0'}</p>
            <div className="current-task"><span>Сейчас в фокусе</span><strong>{activeTask?.title || 'Выбери задачу из списка'}</strong></div>
          </section>

          <TaskList tasks={tasks} activeId={activeId} onAdd={addTask} onToggle={toggleTask}
            onSelect={setActiveId} onDelete={deleteTask} />
        </div>

        <div className="below-board">
          <div className="session-stats"><strong>{timer.sessions}</strong><span>сессий за этот заход</span><span className="stat-divider" /><strong>{doneCount}</strong><span>задач выполнено</span></div>
          <p>Во время перерыва можно просто посмотреть в окно.</p>
        </div>
        {storageError && <p role="alert" className="storage-error">Браузер не разрешил сохранить задачи. Они останутся доступны, пока эта страница открыта.</p>}
        <details className="how-to">
          <summary>Как пользоваться</summary>
          <p>Добавь задачу и нажми на её название. Запусти таймер на 25 минут. После завершения отметь задачу галочкой и включи перерыв на 5 минут. После нескольких сессий можно отдохнуть 15 минут.</p>
          <p>Переключение режима сбрасывает таймер. Задачи сохраняются, а таймер и счётчик сессий начинаются заново после перезагрузки страницы.</p>
        </details>
      </main>
      <footer>Фокус · небольшой помощник для учёбы</footer>
    </div>
  );
}
