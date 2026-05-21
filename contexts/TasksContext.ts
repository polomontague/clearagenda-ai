import { createContext } from "react"
import Task from "@/types/Task"

const TasksContext = createContext<{
    tasks: Task[],
    addTask: (task: Task) => void,
    updateTask: (task: Task) => void,
    removeTask: (task: Task) => void,
    loading: boolean
}>({
    tasks: [],
    addTask: () => {},
    updateTask: () => {},
    removeTask: () => {},
    loading: true
})

export default TasksContext