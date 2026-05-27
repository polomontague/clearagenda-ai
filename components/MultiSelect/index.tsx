"use client"
import styes from "./MultiSelect.module.css"

type MultiSelectOption<Value> = {
    value: Value,
    label: string
}

type MultiSelectProps<Value> = {
    fieldset?: boolean,
    options: {
        [Key in keyof Value]: MultiSelectOption<Value[Key]>[]
    }
    value: Value,
    onChange: (value: Value) => void
}

export default function MultiSelect<Value extends Record<string, any>>(props: MultiSelectProps<Value>) {
    const handleClick = <Key extends keyof Value>(key: Key, value: Value[Key]) => {
        const newValue = { ...props.value }
        newValue[key] = value
        props.onChange(newValue)
    }

    return (
        <div className={`${styes.background} ${props.fieldset ? styes.fieldset : ""}`}>
            {Object.keys(props.options).map(key => (
                <ul
                    key={key}
                    className={styes.lstOptions}
                >
                    {props.options[key].map(option => {
                        const selected = option.value === props.value[key]
                        return (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    className={`${styes.btnOption} ${selected ? styes.selected : ""}`}
                                    onClick={() => handleClick(key, option.value)}
                                >{option.label}</button>
                            </li>
                        )
                    })}
                </ul>
            ))}
        </div>
    )
}