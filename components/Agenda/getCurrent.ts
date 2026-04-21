import { CompletionItem } from "./getDateItems"

export default function getCurrent(items: CompletionItem[]) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type === "task") {
            for (let i2 = 0; i2 < item.steps.length; i2++) {
                if (!item.steps[i2].completed) {
                    return {
                        item,
                        step: item.steps[i2]
                    }
                }
            }
        }
    }
}