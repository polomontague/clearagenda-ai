import Wizard, { Slide } from "@/components/Wizard"
import UpdateThemeForm from "@/components/UpdateThemeForm"
import UpdateAccentForm from "@/components/UpdateAccentForm"
import UpdatePreferencesHoursForm from "@/components/UpdatePreferencesHoursForm"
import LinkButton from "@/components/LinkButton"

export default function SetUpPage() {
    return (
        <Wizard
            label="Set Up"
        >
            <Slide label="Theme">
                <UpdateThemeForm />
            </Slide>
            <Slide label="Accent">
                <UpdateAccentForm />
            </Slide>
            <Slide label="Work Hours">
                <UpdatePreferencesHoursForm />
            </Slide>
            <Slide label="All Set!">
                <p>
                    Now let's fill your agenda!
                </p>
                <LinkButton href="/memory" label="Go to Memory" />
            </Slide>
        </Wizard>
    )
}