
"use client"

import { useState, useEffect, useCallback } from "react"
import type { TaskFormValues } from "@/app/admin/tasks/new/page"

export type Task = TaskFormValues & {
  id: number;
  completed: boolean;
};


const TASKS_STORAGE_KEY = "tasks"

const defaultTasks: Task[] = [
  { id: 1, title: "Survey Completion", description: "Complete a short survey about your shopping habits.", reward: 5.00, completed: false, isFeatured: true, showAd: true, duration: 15, status: "Active", adLink: "" },
  { id: 2, title: "App Download", description: "Download and install our partner's new mobile app.", reward: 10.00, completed: false, isFeatured: true, showAd: true, duration: 30, status: "Active", adLink: "" },
  { id: 3, title: "Watch a Video Ad", description: "Watch a 30-second promotional video.", reward: 2.50, completed: false, isFeatured: false, showAd: true, duration: 30, status: "Active", adLink: "" },
  { id: 4, title: "Social Media Share", description: "Share our promotional post on your social media profile.", reward: 7.50, completed: false, isFeatured: false, showAd: false, duration: 0, status: "Inactive", adLink: "" },
  { id: 5, title: "Product Review", description: "Write a review for a product you recently purchased.", reward: 12.00, completed: false, isFeatured: true, showAd: true, duration: 20, status: "Active", adLink: "" },
  { id: 6, title: "Data Entry Task", description: "Enter data from a scanned document into a spreadsheet.", reward: 15.00, completed: false, isFeatured: false, showAd: false, duration: 0, status: "Active", adLink: "" },
]

const getStoredData = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") {
        return defaultValue;
    }
    try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored) as T;
        }
    } catch (error) {
        console.error(`Failed to parse ${key} from localStorage`, error);
    }
    return defaultValue;
}

const setStoredData = <T>(key: string, data: T) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => getStoredData(TASKS_STORAGE_KEY, defaultTasks));

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === TASKS_STORAGE_KEY) {
         setTasks(getStoredData(TASKS_STORAGE_KEY, defaultTasks))
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])
  
  const updateTasks = useCallback((newTasks: Task[]) => {
    setStoredData(TASKS_STORAGE_KEY, newTasks);
    setTasks(newTasks);
  }, []);

  const addTask = useCallback((taskData: TaskFormValues) => {
    setTasks(prevTasks => {
      const newId = prevTasks.length > 0 ? Math.max(...prevTasks.map(t => t.id)) + 1 : 1;
      const newTask: Task = {
        ...taskData,
        id: newId,
        completed: false,
      };
      const updatedTasks = [...prevTasks, newTask];
      setStoredData(TASKS_STORAGE_KEY, updatedTasks);
      return updatedTasks;
    });
  }, []);

  const updateTask = useCallback((taskId: number, updatedData: Partial<TaskFormValues>) => {
    setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => 
            task.id === taskId ? { ...task, ...updatedData } : task
        );
        setStoredData(TASKS_STORAGE_KEY, updatedTasks);
        return updatedTasks;
    });
  }, []);

  const deleteTask = useCallback((taskId: number) => {
    setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== taskId);
        setStoredData(TASKS_STORAGE_KEY, updatedTasks);
        return updatedTasks;
    });
  }, []);

  const completeTask = useCallback((taskId: number) => {
     setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        setStoredData(TASKS_STORAGE_KEY, updatedTasks);
        return updatedTasks;
     });
  }, []);

  return { tasks, setTasks: updateTasks, addTask, updateTask, deleteTask, completeTask };
}
