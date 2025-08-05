
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
const USER_COMPLETED_TASKS_PREFIX = "completedTasks-";

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const loadTasks = useCallback(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      if (userId) {
        const completedKey = `${USER_COMPLETED_TASKS_PREFIX}${userId}`;
        const storedCompleted = localStorage.getItem(completedKey);
        if (storedCompleted) {
          setCompletedTaskIds(new Set(JSON.parse(storedCompleted)));
        }
      }

    } catch (error) {
      console.error("Error fetching tasks from localStorage: ", error);
    }
  }, [userId]);

  useEffect(() => {
    loadTasks();
    const handleStorageChange = () => loadTasks();
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadTasks]);

  const addTask = useCallback((taskData: TaskFormValues) => {
    try {
      const currentTasks = tasks;
      const newTask: Task = {
        ...taskData,
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      const updatedTasks = [...currentTasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error adding task to localStorage: ", error);
    }
  }, [tasks]);

  const updateTask = useCallback((taskId: string, updatedData: Partial<TaskFormValues>) => {
    try {
        const updatedTasks = tasks.map(t => t.id === taskId ? {...t, ...updatedData} : t);
        setTasks(updatedTasks);
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error updating task in localStorage: ", error);
    }
  }, [tasks]);

  const deleteTask = useCallback((taskId: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error deleting task from localStorage: ", error);
    }
  }, [tasks]);

  const completeTask = useCallback((taskId: string) => {
    if (!userId) {
        console.error("User ID is required to complete a task.");
        return;
    }
    try {
        const newCompletedTaskIds = new Set(completedTaskIds).add(taskId);
        setCompletedTaskIds(newCompletedTaskIds);
        localStorage.setItem(`${USER_COMPLETED_TASKS_PREFIX}${userId}`, JSON.stringify(Array.from(newCompletedTaskIds)));
    } catch (error) {
        console.error("Error completing task in localStorage: ", error);
    }
  }, [userId, completedTaskIds]);
  
  const getTaskById = useCallback((taskId: string): Task | undefined => {
    return tasks.find(t => t.id === taskId);
  }, [tasks]);

  return { tasks, addTask, updateTask, deleteTask, completeTask, getTaskById, completedTaskIds };
}
