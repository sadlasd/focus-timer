import React, { useState } from 'react';

export default function TaskList({ tasks, activeId, onAdd, onToggle, onSelect, onDelete }) {
  const [title, setTitle] = useState('');
  const done = tasks.filter((task) => task.done).length;

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  }

  return (
    <section className="tasks-panel" aria-labelledby="tasks-title">
      <div className="section-heading">
        <h2 id="tasks-title">Мои задачи</h2>
        <span>{done} из {tasks.length}</span>
      </div>
      <p className="muted task-hint">Выбери одну, с которой начнёшь.</p>

      <form className="task-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="new-task">Новая задача</label>
        <input id="new-task" placeholder="Что нужно сделать?" maxLength={120}
          value={title} onChange={(event) => setTitle(event.target.value)} />
        <button type="submit" className="add-task" disabled={!title.trim()} aria-label="Добавить задачу">+</button>
      </form>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>Пока ни одной задачи</p>
          <span>Добавь что-нибудь небольшое на первые 25 минут.</span>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task ${activeId === task.id && !task.done ? 'active-task' : ''} ${task.done ? 'done-task' : ''}`}>
              <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)}
                aria-label={`Выполнено: ${task.title}`} />
              <button type="button" className="task-name" disabled={task.done}
                aria-pressed={activeId === task.id && !task.done} onClick={() => onSelect(task.id)}>
                <span>{task.title}</span>
                {activeId === task.id && !task.done && <small>Сейчас в фокусе</small>}
              </button>
              <button type="button" className="delete-task" onClick={() => onDelete(task.id)}
                aria-label={`Удалить: ${task.title}`} title="Удалить задачу">×</button>
            </li>
          ))}
        </ul>
      )}
      <p className="save-note">Задачи сохраняются в этом браузере.</p>
    </section>
  );
}
