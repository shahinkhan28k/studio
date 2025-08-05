
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

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
};

const TASKS_COLLECTION = "tasks"
const USER_COMPLETED_TASKS_SUBCOLLECTION = "completedTasks";

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasksQuery = query(collection(db, TASKS_COLLECTION));
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasksData = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      setTasks(tasksData);

      if (userId) {
        const completedTasksQuery = query(collection(db, `users/${userId}/${USER_COMPLETED_TASKS_SUBCOLLECTION}`));
        const completedSnapshot = await getDocs(completedTasksQuery);
        const completedIds = new Set(completedSnapshot.docs.map(doc => doc.id));
        setCompletedTaskIds(completedIds);
      }

    } catch (error) {
      console.error("Error fetching tasks: ", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (taskData: TaskFormValues) => {
    try {
      await addDoc(collection(db, TASKS_COLLECTION), {
        ...taskData,
        createdAt: serverTimestamp(),
      });
      await loadTasks();
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }, [loadTasks]);

  const updateTask = useCallback(async (taskId: string, updatedData: Partial<TaskFormValues>) => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, updatedData);
      await loadTasks();
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  }, [loadTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  }, []);

  const completeTask = useCallback(async (taskId: string) => {
    if (!userId) {
        console.error("User ID is required to complete a task.");
        return;
    }
    try {
        const completedTaskRef = doc(db, `users/${userId}/${USER_COMPLETED_TASKS_SUBCOLLECTION}`, taskId);
        await setDoc(completedTaskRef, { completedAt: serverTimestamp() });
        setCompletedTaskIds(prev => new Set(prev).add(taskId));
    } catch (error) {
        console.error("Error completing task: ", error);
    }
  }, [userId]);
  
  const getTaskById = useCallback(async (taskId: string): Promise<Task | undefined> => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      const docSnap = await getDoc(taskRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Task;
      }
      return undefined;
    } catch(error) {
        console.error("Error fetching task by id", error);
        return undefined;
    }
  }, []);

  return { tasks, loading, addTask, updateTask, deleteTask, completeTask, getTaskById, completedTaskIds };
}
