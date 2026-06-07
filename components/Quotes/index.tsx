import styles from "./Quotes.module.css"
import { QuoteOpenIcon, QuoteCloseIcon } from "../Icons"

type Quote = {
    content: string
}

type QuotesProps = {
    quotes: Quote[]
}

export default function Quotes({ quotes }: QuotesProps) {
    return (
        <ul className={styles.lst}>
            {quotes.map(quote => (
                <li key={quote.content}>
                    <blockquote className={styles.card}>
                        <div className={styles.containerOpenIcon}>
                            <QuoteOpenIcon />
                        </div>
                        <p className={styles.content}>{quote.content}</p>
                        <div className={styles.containerCloseIcon}>
                            <QuoteCloseIcon />
                        </div>
                    </blockquote>
                </li>
            ))}
        </ul>
    )
}