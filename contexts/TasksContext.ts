import { createContext } from "react"
import Task from "@/types/Task"

const TasksContext = createContext<{
    tasks: Task[],
    addTask: (task: Task) => void,
    updateTask: (task: Task) => void,
    removeTask: (task: Task) => void
}>({
    tasks: [],
    addTask: () => {},
    updateTask: () => {},
    removeTask: () => {}
})

export default TasksContext