"use client"
import styles from "./TimezonePicker.module.css"
import { useState, useMemo, useEffect } from "react"
import SearchInput from "../SearchInput"
import { MagnifyingGlassIcon } from "../Icons"

type Option = {
    value: string,
    label: string
}

type TimezonePickerProps = {
    fieldset?: boolean,
    value: string,
    onChange: (value: string) => void
}

export default function TimezonePicker({ fieldset, value, onChange }: TimezonePickerProps) {
    const [search, setSearch] = useState("")
    const options = useMemo<Option[]>(() => {
        const timezones = Intl.supportedValuesOf("timeZone")
        return timezones.map(timezone => ({
            value: timezone,
            label: timezone.split("/")[1].split("_").join(" ")
        })).sort((a, b) => a.label.localeCompare(b.label))
    }, [])
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([])

    useEffect(() => {
        const lowercaseSearch = search.toLowerCase()
        setFilteredOptions(options.filter(option => {
            return option.label.toLowerCase().includes(lowercaseSearch)
        }))
    }, [search])

    return (
        <div className={`${styles.frame} ${fieldset ? styles.fieldset : ""}`}>
            <SearchInput fieldset placeholder="Search Timezones..." value={search} onChange={setSearch} />
            <div className={styles.containerOptions}>
                {filteredOptions.length ? (
                    <ul className={styles.lstOptions}>
                        {filteredOptions.map(option => {
                            const selected = option.value === value
                            return (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        className={`${styles.option} ${selected ? styles.selected : ""}`}
                                        onClick={() => onChange(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className={styles.containerPlaceholder}>
                        <MagnifyingGlassIcon />
                        <span className={styles.label}>No Results</span>
                    </div>
                )}
            </div>
        </div>
    )
}