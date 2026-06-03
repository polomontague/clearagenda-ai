import { Fragment } from "react/jsx-runtime"
import styles from "./Carousel.module.css"

type Segment = {
    type: "normal" | "emphasis",
    text: string
}

type Break = {
    type: "break"
}

type Image = {
    width: number,
    height: number,
    url: string
}

type Item = {
    label: Segment[],
    image: Image
}

type CarouselProps = {
    items: Item[]
}

export default function Carousel({ items }: CarouselProps) {
    const splitSegmentsInHalf = (segments: Segment[]): (Segment | Break)[] => {
        const words: Segment[] = []
        for (const segment of segments) {
            const split = segment.text.trim().split(/\s+/g)
            for (const word of split) {
                words.push({
                    type: segment.type,
                    text: word
                })
            }
        }
        const totalLength = words.map(word => word.text).join(" ").length
        const result: (Segment | Break)[] = []
        let counter = 0
        let addedBreak = false
        words.forEach((word, i) => {
            counter += word.text.length + (i < (words.length - 1) ? 1 : 0) // Pad for spaces between words
            result.push(word)
            if (!addedBreak && counter >= (totalLength / 2)) { // Reached half-way point
                result.push({
                    type: "break"
                })
                addedBreak = true
            }
        })
        return result
    }

    const segmentsToString = (segments: (Segment | Break)[]) => {
        return segments.filter(segment => segment.type !== "break")
            .map(segment => segment.text)
            .join(" ")
    }

    return (
        <ul className={styles.carousel}>
            {items.map((item, i) => {
                const segments = splitSegmentsInHalf(item.label)
                return (
                    <li key={i}>
                        <div className={styles.card}>
                            <div className={styles.containerLabel}>
                                <h5 className={styles.label}>
                                    {segments.map((segment, i) => segment.type === "break" ? (
                                        <br key={i} />
                                    ) : (
                                        <span
                                            key={i}
                                            className={`${styles.segment} ${segment.type === "emphasis" ? styles.accent : ""}`}
                                        >
                                            {segment.text}{i < segments.length - 1 ? " " : ""}
                                        </span>
                                    ))}
                                </h5>
                            </div>
                            <img
                                className={styles.img}
                                width={item.image.width}
                                height={item.image.height}
                                src={item.image.url}
                                alt={segmentsToString(item.label)}
                            />
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}