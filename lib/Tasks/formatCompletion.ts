export default function formatCompletion(completion: number): string {
    if (completion === 0) return "Not Started"
    if (completion === 1) return "Complete"
    return `${completion * 100}% Complete`
}