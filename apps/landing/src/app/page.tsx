"use client"

import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeaturesSection from "@/components/FeaturesSection"
import CtaSection from "@/components/CtaSection"
import Footer from "@/components/Footer"

export default function LandingPage() {
    return (
        <div className="flex min-h-[100dvh] w-dvw flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <FeaturesSection />
                {/* <TestimonialsSection /> */}
                {/* <PricingSection /> */}
                <CtaSection />
            </main>
            <Footer />
        </div>
    )
}
