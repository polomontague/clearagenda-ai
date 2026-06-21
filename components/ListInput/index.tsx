"use client"
import styles from "./ListInput.module.css"
import { useState } from "react"
import { PlusIcon, TrashCanIcon } from "../Icons"
import TextInput from "../TextInput"

type ListInputProps = {
    fieldset?: boolean,
    placeholder: string,
    value: string[],
    onChange: (value: string[]) => void
}

export default function ListInput({ fieldset = false, placeholder, value, onChange }: ListInputProps) {
    const [item, setItem] = useState("")
    
    const handleAdd = () => {
        if (!item) return
        onChange([ ...value, item ])
        setItem("")
    }

    const handleRemoveClick = (index: number) => {
        const newValue = [ ...value ]
        newValue.splice(index, 1)
        onChange(newValue)
    }

    return (
        <div className={`${styles.background} ${fieldset ? styles.fieldset : ""}`}>
            <header className={styles.header}>
                <TextInput
                    fieldset
                    placeholder={placeholder}
                    value={item}
                    onChange={setItem}
                    onEnter={handleAdd}
                />
                <button
                    type="button"
                    className={styles.btnAdd}
                    disabled={!item}
                    onClick={handleAdd}
                >
                    <PlusIcon />
                </button>
            </header>
            {value.length ? (
                <ul className={styles.lstItems}>
                    {value.map((item, i) => (
                        <li key={i} className={styles.item}>
                            <span className={styles.label}>{item}</span>
                            <button
                                type="button"
                                className={styles.btnRemove}
                                onClick={() => handleRemoveClick(i)}
                            >
                                <TrashCanIcon />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}