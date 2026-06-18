import Task from "@/types/Task"
import Utility from "../Utility"

export default function getLength(task: Task): string {
    let minutes = task.steps.reduce((total, step) => total + step.duration, 0)
    return Utility.formatDuration(minutes)
}