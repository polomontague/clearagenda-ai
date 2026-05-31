import Accent from "@/types/Accent"
import Theme from "@/types/Theme"

const Appearance: {
    DEFAULT_THEME: Exclude<Theme, "system">,
    DEFAULT_ACCENT: Accent,
    LIGHT: string,
    DARK: string
} = {
    DEFAULT_THEME: "light",
    DEFAULT_ACCENT: "sky",
    LIGHT: "#d6d8da",
    DARK: "#1e2022"
}

export default Appearance