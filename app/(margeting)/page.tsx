"use client"
import Preview from "@/components/Preview"
import BeforeAndAfter from "@/components/BeforeAndAfter"
import Hero from "@/components/Hero"
import ValueProposition from "@/components/ValueProposition"
import Pain from "@/components/Pain"
import Transition from "@/components/Transition"
import CoreFeatures from "@/components/CoreFeatures"
import CorePhilosophy from "@/components/CorePhilosophy"
import UseCases from "@/components/UseCases"
import Testimony from "@/components/Testimony"
import CTA from "@/components/CTA"

export default function HomePage() {
    return (
        <div>
            <Hero />
            <ValueProposition />
            <Pain />
            <Transition />
            <Preview />
            <CoreFeatures />
            <BeforeAndAfter />
            <CorePhilosophy />
            <UseCases />
            <Testimony />
            <CTA />
        </div>
    )
}