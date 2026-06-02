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
    const splitSegmentsInHalf = (segments: Segment[]) => {
        
    }

    const segmentsToString = (segments: Segment[]) => {
        return segments.reduce((str, segment) => str += segment.text, "")
    }

    return (
        <ul className={styles.carousel}>
            {items.map(item => (
                <li key={item.label}>
                    <div className={styles.card}>
                        <div className={styles.containerLabel}>
                            <h5 className={styles.label}>
                                {item.label.map((segment, i) => (
                                    <span
                                        key={i}
                                        className={`${styles.segment} ${segment.type === "emphasis" ? styles.accent : ""}`}
                                    >
                                        {segment.text}
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
            ))}
        </ul>
    )
}