import CardGroup from "@/components/CardGroup"
import Preview from "@/components/Preview"

export default function HomePage() {
    return (
        <div>
            <CardGroup
                cards={[
                    {
                        color: "red",
                        label: "Before",
                        children: (
                            <ul>
                                <li>Scattered Tasks</li>
                                <li>Lost Context</li>
                                <li>Manual Planning</li>
                                <li>Disconnected Tools</li>
                            </ul>
                        )
                    },
                    {
                        color: "green",
                        label: "With ClearAgenda AI",
                        children: (
                            <ul>
                                <li>Scructured Workflows</li>
                                <li>Automated Scheduling</li>
                                <li>Persistant Memory</li>
                                <li>Unified System</li>
                            </ul>
                        )
                    }
                ]}
            />
            <Preview />
        </div>
    )
}