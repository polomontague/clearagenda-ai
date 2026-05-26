import { createContext } from "react"
import Task, { Completion } from "@/types/Task"

const TasksContext = createContext<{
    tasks: Task[],
    addTask: (task: Task) => void,
    replaceTask: (task: Task) => void,
    removeTask: (task: Task) => void,
    updateCompleted: (taskId: number, stepId: number, completed: string) => void,
    updateCompletion: (taskId: number, stepId: number, completion: Completion) => void
    loading: boolean
}>({
    tasks: [],
    addTask: () => {},
    replaceTask: () => {},
    removeTask: () => {},
    updateCompleted: () => {},
    updateCompletion: () => {},
    loading: true
})

export default TasksContext