import Accent from "@/types/Accent"
import Theme from "@/types/Theme"

const Appearance: {
    DEFAULT_THEME: Exclude<Theme, "system">,
    DEFAULT_ACCENT: Accent
} = {
    DEFAULT_THEME: "light",
    DEFAULT_ACCENT: "sky"
}

export default Appearance