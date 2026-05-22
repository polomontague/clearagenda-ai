import Modal from "../Modal"
import FieldFrame from "@/components/FieldFrame"
import UpdateNameForm from "@/components/UpdateNameForm"
import UpdateEmailForm from "@/components/UpdateEmailForm"
import UpdatePhoneForm from "@/components/UpdatePhoneForm"
import UpdatePasswordForm from "@/components/UpdatePasswordForm"
import UpdatePreferencesHoursForm from "@/components/UpdatePreferencesHoursForm"
import UpdateThemeForm from "@/components/UpdateThemeForm"
import UpdateAccentForm from "@/components/UpdateAccentForm"
import SlideField from "../SlideField"

type SettingsModalProps = {
    open: boolean,
    onRequestClose: () => void
}

export default function SettingsModal(props: SettingsModalProps) {
    return (
        <Modal
            label="Settings"
            open={props.open}
            onRequestClose={props.onRequestClose}
        >
            <FieldFrame>
                <SlideField label="Profile">
                    <FieldFrame>
                        <SlideField label="Name">
                            <UpdateNameForm />
                        </SlideField>
                        <SlideField label="Email">
                            <UpdateEmailForm />
                        </SlideField>
                        <SlideField label="Phone Number">
                            <UpdatePhoneForm />
                        </SlideField>
                    </FieldFrame>
                </SlideField>
                <SlideField label="Security">
                    <SlideField label="Password">
                        <UpdatePasswordForm />
                    </SlideField>
                </SlideField>
                <SlideField label="Preferences">
                    <FieldFrame>
                        <SlideField label="Appearance">
                            <FieldFrame>
                                <SlideField label="Theme">
                                    <UpdateThemeForm />
                                </SlideField>
                                <SlideField label="Accent Color">
                                    <UpdateAccentForm />
                                </SlideField>
                            </FieldFrame>
                        </SlideField>
                        <SlideField label="Daily Hours">
                            <UpdatePreferencesHoursForm />
                        </SlideField>
                    </FieldFrame>
                </SlideField>
            </FieldFrame>
        </Modal>
    )
}