import Task from "@/types/Task"
import Utility from "../Utility"

export default function getDeadline(task: Task): string {
    if (!task.deadline) return "None"
    if (task.occurs === "once") {
        return Utility.formatDate(Utility.loadLocalDate(task.deadline))
    } else { // Repeating
        return `${task.deadline} ${task.deadline === 1 ? "Day" : "Days"}`
    }
    
}