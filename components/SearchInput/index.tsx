"use client"
import styles from "./SearchInput.module.css"
import { MagnifyingGlassIcon } from "@/components/Icons"

type SearchInputProps = {
    fieldset?: boolean,
    placeholder: string,
    value: string,
    onChange: (value: string) => void
}

const SearchInput = (props: SearchInputProps) => {
    return (
        <div className={`${styles.input} ${props.fieldset ? styles.fieldset : ""}`}>
            <div className={styles.containerIcon}>
                <MagnifyingGlassIcon />
            </div>
            <div className={styles.containerInput}>
                <input
                    type="text"
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={(evt) => props.onChange(evt.target.value)}
                />
            </div>
        </div>
    )
}

export default SearchInput