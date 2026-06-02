"use client"
import styles from "./Preview.module.css"
import { useState } from "react"
import SelectBar from "../SelectBar"
import Carousel from "@/components/Carousel"

export default function Preview() {
    const [platform, setPlatform] = useState("mobile")

    return (
        <section>
            <div className={styles.center}>
                <div className={styles.containerPlatform}>
                    <SelectBar
                        options={[
                            { value: "mobile", label: "Mobile" },
                            { value: "computer", label: "Desktop" }
                        ]}
                        value={platform}
                        onChange={setPlatform}
                    />
                </div>
            </div>
            <Carousel
                items={[
                    {
                        label: [
                            { type: "normal", text: "Clear Your " },
                            { type: "emphasis", text: "Mind" }
                        ],
                        image: {
                            width: 2064,
                            height: 1738,
                            url: "/desktop.png"
                        }
                    },
                    {
                        label: [
                            { type: "normal", text: "Complex Tasks Are Broken Down Into " },
                            { type: "emphasis", text: "Actionable Steps" }
                        ],
                        image: {
                            width: 2064,
                            height: 1738,
                            url: "/desktop.png"
                        }
                    },
                    {
                        label: [
                            { type: "normal", text: "Don't Forget With " },
                            { type: "emphasis", text: "Memory Bank" }
                        ],
                        image: {
                            width: 2064,
                            height: 1738,
                            url: "/desktop.png"
                        }
                    },
                    {
                        label: [
                            { type: "normal", text: "Tasks Are " },
                            { type: "emphasis", text: "Automatically" },
                            { type: "normal", text: " Scheduled In Order Of " },
                            { type: "emphasis", text: "Priority" }
                        ],
                        image: {
                            width: 2064,
                            height: 1738,
                            url: "/desktop.png"
                        }
                    },
                    {
                        label: [
                            { type: "normal", text: "Set How Many " },
                            { type: "emphasis", text: "Hours To Fill" },
                            { type: "normal", text: " Each Weekday" }
                        ],
                        image: {
                            width: 2064,
                            height: 1738,
                            url: "/desktop.png"
                        }
                    }
                ]}
            />
        </section>
    )
}