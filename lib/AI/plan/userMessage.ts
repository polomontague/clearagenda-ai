import { Clarity, Friction, Specification } from "@/types/Task";

export const userMessage = ({ description, clarity, friction, specifications }: {
    description: string,
    clarity: Clarity,
    friction: Friction[],
    specifications: Specification[]
}): string => `TASK:
${description}

CLARITY:
${clarity}

FRICTION:
${friction.length ? friction.join(", ") : "none"}

SPECIFICATIONS:
${specifications.length ? specifications.join(", ") : "none"}`