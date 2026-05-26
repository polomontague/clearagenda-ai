"use client"
import TasksContext from "@/contexts/TasksContext"
import { ReactNode, useState, useEffect } from "react"
import Task, { Completion } from "@/types/Task"
import API from "@/lib/API"

export default function TasksProvider(props: {
    children: ReactNode
}) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get<{ tasks: Task[] }>("/api/v1/tasks", true).then(data => {
            setTasks(data.tasks)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const addTask = (task: Task) => {
        setTasks([ ...tasks, task ])
    }

    const replaceTask = (task: Task) => {
        const newTasks = [ ...tasks ]
        const index = newTasks.findIndex(task2 => task2.id === task.id)
        newTasks[index] = task
        setTasks(newTasks)
    }

    const removeTask = (task: Task) => {
        const newTasks = tasks.filter(task2 => task2.id !== task.id)
        setTasks(newTasks)
    }

    const updateCompleted = (taskId: number, stepId: number, completed: string) => {
        const newTasks = [ ...tasks ]
        const task = newTasks.find(task => task.id === taskId)
        if (!task) return
        if (task.occurs !== "once") return
        const step = task.steps.find(step => step.id === stepId)
        if (!step) return
        step.completed = completed
        setTasks(newTasks)
    }

    const updateCompletion = (taskId: number, stepId: number, completion: Completion) => {
        const newTasks = [ ... tasks ]
        const task = newTasks.find(task => task.id === taskId)
        if (!task) return
        if (task.occurs !== "repeating") return
        const step = task.steps.find(step => step.id === stepId)
        if (!step) return
        step.completions.push(completion)
        setTasks(newTasks)
    }

    return (
        <TasksContext.Provider
            value={{
                tasks,
                addTask,
                replaceTask,
                removeTask,
                updateCompleted,
                updateCompletion,
                loading
            }}
        >
            {props.children}
        </TasksContext.Provider>
    )
}