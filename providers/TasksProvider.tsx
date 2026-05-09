"use client"
import TasksContext from "@/contexts/TasksContext"
import { ReactNode, useState, useEffect } from "react"
import Task from "@/types/Task"
import API from "@/lib/API"

export default function TasksProvider(props: {
    children: ReactNode
}) {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        API.get<{ tasks: Task[] }>("/api/v1/tasks", true).then(data => {
            setTasks(data.tasks)
        })
    }, [])

    const addTask = (task: Task) => {
        setTasks([ ...tasks, task ])
    }

    const updateTask = (task: Task) => {
        const newTasks = [ ...tasks ]
        const index = newTasks.findIndex(task2 => task2.id === task.id)
        newTasks[index] = task
        setTasks(newTasks)
    }

    const removeTask = (task: Task) => {
        const newTasks = tasks.filter(task2 => task2.id !== task.id)
        setTasks(newTasks)
    }

    return (
        <TasksContext.Provider
            value={{
                tasks,
                addTask,
                updateTask,
                removeTask
            }}
        >
            {props.children}
        </TasksContext.Provider>
    )
}