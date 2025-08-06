
"use client"

import { useState, useEffect, useCallback } from "react"

export interface TaskFormValues {
  title: string
  description: string
  reward: number
  taskLink?: string
  isFeatured: boolean
  showAd: boolean
  duration: number
  status: "Active" | "Inactive"
  adLink?: string
}

export type Task = TaskFormValues & {
  id: string;
  createdAt: string;
};

const TASKS_STORAGE_KEY = "tasks"
const ALL_COMPLETED_TASKS_KEY = "allCompletedTasks";


// Helpers to abstract localStorage access
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setInStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};


export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const loadTasks = useCallback(() => {
    setTasks(getFromStorage<Task[]>(TASKS_STORAGE_KEY, []));
    if (userId) {
      const allCompletedTasks = getFromStorage<Record<string, string[]>>(ALL_COMPLETED_TASKS_KEY, {});
      setCompletedTaskIds(new Set(allCompletedTasks[userId] || []));
    } else {
      setCompletedTaskIds(new Set());
    }
  }, [userId]);

  useEffect(() => {
    loadTasks();
    window.addEventListener('storage', loadTasks);
    return () => {
        window.removeEventListener('storage', loadTasks);
    };
  }, [loadTasks]);

  const addTask = useCallback((taskData: TaskFormValues) => {
    const currentTasks = getFromStorage<Task[]>(TASKS_STORAGE_KEY, []);
    const newTask: Task = {
      ...taskData,
      id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...currentTasks, newTask];
    setInStorage(TASKS_STORAGE_KEY, updatedTasks);
  }, []);

  const updateTask = useCallback((taskId: string, updatedData: Partial<TaskFormValues>) => {
    const currentTasks = getFromStorage<Task[]>(TASKS_STORAGE_KEY, []);
    const updatedTasks = currentTasks.map(t => t.id === taskId ? {...t, ...updatedData} : t);
    setInStorage(TASKS_STORAGE_KEY, updatedTasks);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    const currentTasks = getFromStorage<Task[]>(TASKS_STORAGE_KEY, []);
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    setInStorage(TASKS_STORAGE_KEY, updatedTasks);
  }, []);

  const completeTask = useCallback((taskId: string) => {
    if (!userId) {
        console.error("User ID is required to complete a task.");
        return;
    }
    const allCompletedTasks = getFromStorage<Record<string, string[]>>(ALL_COMPLETED_TASKS_KEY, {});
    const userCompleted = allCompletedTasks[userId] || [];
    const newCompletedSet = new Set(userCompleted).add(taskId);
    allCompletedTasks[userId] = Array.from(newCompletedSet);
    setInStorage(ALL_COMPLETED_TASKS_KEY, allCompletedTasks);
  }, [userId]);
  
  const getTaskById = useCallback((taskId: string): Task | undefined => {
    const allTasks = getFromStorage<Task[]>(TASKS_STORAGE_KEY, []);
    return allTasks.find(t => t.id === taskId);
  }, []);

  return { tasks, addTask, updateTask, deleteTask, completeTask, getTaskById, completedTaskIds, refreshTasks: loadTasks };
}
