"use client"
import styles from "./Preview.module.css"
import { useState } from "react"
import SelectBar from "../SelectBar"
import Carousel from "@/components/Carousel"
import Eyebrow from "../Eyebrow"

type DeviceType = "mobile" | "desktop"

export default function Preview() {
    const [deviceType, setDeviceType] = useState<DeviceType>(window.innerWidth <= 768 ? "mobile" : "desktop")

    return (
        <section className={styles.background}>
            <Eyebrow>How it works</Eyebrow>
            <div className={styles.center}>
                <div className={styles.containerPlatform}>
                    <SelectBar
                        options={[
                            { value: "mobile", label: "Mobile" },
                            { value: "desktop", label: "Desktop" }
                        ] as const}
                        value={deviceType}
                        onChange={setDeviceType}
                    />
                </div>
            </div>
            <Carousel
                items={[
                    {
                        label: [
                            { type: "normal", text: "Clear Your" },
                            { type: "emphasis", text: "Mind" }
                        ],
                        image: {
                            width: 1888,
                            height: 1312,
                            url: `/add-task-${deviceType}.png`
                        }
                    },
                    {
                        label: [
                            { type: "normal", text: "Complex Tasks Are Split Into " },
                            { type: "emphasis", text: "Actionable Steps" }
                        ],
                        image: {
                            width: 1888,
                            height: 1312,
                            url: `/step-modal-${deviceType}.png`
                        }
                    },
                    {
                        label: [
                            { type: "emphasis", text: "Memory Bank" },
                            { type: "normal", text: "Remembers Everything" }
                        ],
                        image: {
                            width: 1888,
                            height: 1312,
                            url: `/memory-${deviceType}.png`
                        }
                    },
                    {
                        label: [
                            { type: "normal", text: "Tasks Are" },
                            { type: "emphasis", text: "Automatically Scheduled" },
                            { type: "normal", text: "By Priority" }
                        ],
                        image: {
                            width: 1888,
                            height: 1312,
                            url: `/tasks-agenda-${deviceType}.png`
                        }
                    },
                    {
                        label: [
                            { type: "emphasis", text: "Single Focus" },
                            { type: "normal", text: "Workflow" }
                        ],
                        image: {
                            width: 1888,
                            height: 1312,
                            url: `/tasks-agenda-${deviceType}.png`
                        }
                    }
                ]}
            />
        </section>
    )
}