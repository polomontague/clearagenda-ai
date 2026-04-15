import SlideModal, { SlideModalOption, SlideModalSlide } from "@/components/SlideModal"
import FieldFrame from "@/components/FieldFrame"
import UpdateNameForm from "@/components/UpdateNameForm"
import UpdateEmailForm from "@/components/UpdateEmailForm"
import UpdatePhoneForm from "@/components/UpdatePhoneForm"
import UpdatePasswordForm from "@/components/UpdatePasswordForm"
import UpdatePreferencesHoursForm from "@/components/UpdatePreferencesHoursForm"
import UpdateThemeForm from "@/components/UpdateThemeForm"
import UpdateAccentForm from "@/components/UpdateAccentForm"

type SettingsModalProps = {
    open: boolean,
    onRequestClose: () => void
}

export default function SettingsModal(props: SettingsModalProps) {
    return (
        <SlideModal
            label="Settings"
            open={props.open}
            onRequestClose={props.onRequestClose}
        >
            <FieldFrame>
                    <SlideModalOption label="Profile">
                    <SlideModalSlide>
                        <FieldFrame>
                            <SlideModalOption label="Name">
                                <SlideModalSlide>
                                    <UpdateNameForm />
                                </SlideModalSlide>
                            </SlideModalOption>
                            <SlideModalOption label="Email">
                                <SlideModalSlide>
                                    <UpdateEmailForm />
                                </SlideModalSlide>
                            </SlideModalOption>
                            <SlideModalOption label="Phone Number">
                                <SlideModalSlide>
                                    <UpdatePhoneForm />
                                </SlideModalSlide>
                            </SlideModalOption>
                        </FieldFrame>
                    </SlideModalSlide>
                </SlideModalOption>
                <SlideModalOption label="Security">
                    <SlideModalSlide>
                        <FieldFrame>
                            <SlideModalOption label="Passsword">
                                <SlideModalSlide>
                                    <UpdatePasswordForm />
                                </SlideModalSlide>
                            </SlideModalOption>
                        </FieldFrame>
                    </SlideModalSlide>
                </SlideModalOption>
                <SlideModalOption label="Preferences">
                    <SlideModalSlide>
                        <FieldFrame>
                            <SlideModalOption label="Appearance">
                                <SlideModalSlide>
                                    <FieldFrame>
                                        <SlideModalOption label="Theme">
                                            <SlideModalSlide>
                                                <UpdateThemeForm />
                                            </SlideModalSlide>
                                        </SlideModalOption>
                                        <SlideModalOption label="Accent Color">
                                            <SlideModalSlide>
                                                <UpdateAccentForm />
                                            </SlideModalSlide>
                                        </SlideModalOption>
                                    </FieldFrame>
                                </SlideModalSlide>
                            </SlideModalOption>
                            <SlideModalOption label="Daily hours">
                                <SlideModalSlide>
                                    <UpdatePreferencesHoursForm />
                                </SlideModalSlide>
                            </SlideModalOption>
                        </FieldFrame>
                    </SlideModalSlide>
                </SlideModalOption>
            </FieldFrame>
        </SlideModal>
    )
}