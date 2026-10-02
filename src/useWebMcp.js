import { useEffect } from 'react';
import { flushSync } from 'react-dom';

// Необязательная интеграция Sites. В обычном браузере этот хук ничего не делает.
export default function useWebMcp(addTask) {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    try {
      Promise.resolve(context.registerTool({
        name: 'add_focus_task',
        title: 'Добавить задачу в Фокус',
        description: 'Добавляет задачу в видимый список и сохраняет её в этом браузере.',
        inputSchema: {
          type: 'object',
          properties: { title: { type: 'string', minLength: 1, maxLength: 120 } },
          required: ['title'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input) ||
            Object.keys(input).some((key) => key !== 'title')) {
            throw new Error('Передай объект с названием задачи в поле title.');
          }
          let task;
          flushSync(() => { task = addTask(input.title); });
          return task;
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch {
      // Недоступность интеграции не должна мешать обычной работе приложения.
    }

    return () => lifecycle.abort();
  }, [addTask]);
}
