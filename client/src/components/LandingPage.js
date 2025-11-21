import React from 'react';
import Navbar from './LandingPage/Navbar';
import HeroSection from './LandingPage/HeroSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import HowItWorksSection from './LandingPage/BentoGrid';
import PerfectCardSection from './LandingPage/PerfectCardSection';
import AboutSection from './LandingPage/AboutSection';
import CTABanner from './LandingPage/CTABanner';
import Footer from './LandingPage/Footer';
import './styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <PerfectCardSection />
            <AboutSection />
            <CTABanner />
            <Footer />
        </div>
    );
};

export default LandingPage;