import React, { useEffect, useRef, useState } from 'react';
import './styles/PerfectCardSection.css';

const PerfectCardSection = () => {
    const sectionRef = useRef(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                // Calculate how far the section is from the center of the viewport
                const offset = window.innerHeight / 2 - (rect.top + rect.height / 2);
                setScrollY(offset);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate transforms based on scroll
    // When offset is 0 (center), cards should be perfectly stacked.
    // When offset is negative (section is below center), cards should be spread out.

    const getCardStyle = (index) => {
        // Base spread distance
        const spread = 60;
        // Animation factor: 0 when centered, 1 when far away
        // We want them to be spread when entering view (rect.top > window.innerHeight)
        // and stacked when centered.

        // Let's simplify: use the raw scrollY relative to section start
        // If section is in view...

        let progress = 0;
        if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // 0 = section just entered bottom
            // 1 = section is fully visible / centered

            const start = windowHeight;
            const end = windowHeight * 0.2; // Stack when near top/center

            progress = (start - rect.top) / (start - end);
            progress = Math.max(0, Math.min(1, progress));
        }

        // Invert progress: 0 (start) -> Spread, 1 (end) -> Stacked
        const spreadFactor = 1 - progress;

        // Card 1 (Top/Back): Green
        // Card 2 (Middle): Blue
        // Card 3 (Bottom/Front): Gold

        // We want them to come from bottom/spread to stacked.
        // Or maybe spread vertically?
        // "Move closer" implies vertical stacking.

        const translateY = index * 50 * spreadFactor; // 50px gap when spread
        const scale = 1 - (index * 0.05 * (1 - progress)); // Slight scale diff that unifies?


        return {
            transform: `translateY(${translateY}px) scale(${1 - index * 0.05})`,
            zIndex: 3 - index,
            opacity: 1
        };
    };

    return (
        <section id="perfect-card" className="perfect-card-section" ref={sectionRef}>
            <div className="perfect-card-container">
                <div className="perfect-card-header">
                    <h2 className="pc-title">Perfect Bank<br />for your needs.</h2>
                    <p className="pc-subtitle">
                        Enjoy the benefits and features that match your<br />
                        unique financial goals and desires.
                    </p>
                </div>

                <div className="cards-stack-wrapper">
                    {/* Green Card (Back) */}
                    <div className="pc-card card-green" style={{ transform: `translateY(${Math.min(0, scrollY * 0.1)}px) scale(0.9)` }}>
                        <div className="pc-card-content">
                            <span className="pc-logo">Bankify.</span>
                            <span className="pc-icon">)))</span>
                        </div>
                    </div>

                    {/* Blue Card (Middle) */}
                    <div className="pc-card card-blue" style={{ transform: `translateY(${Math.min(0, scrollY * 0.05)}px) scale(0.95)` }}>
                        <div className="pc-card-content">
                            <span className="pc-logo">Bankify.</span>
                            <span className="pc-icon">)))</span>
                        </div>
                    </div>

                    {/* Gold Card (Front) */}
                    <div className="pc-card card-gold">
                        <div className="pc-card-content">
                            <div className="pc-card-top">
                                <span className="pc-logo">Bankify.</span>
                                <span className="pc-icon">)))</span>
                            </div>
                            <div className="pc-card-number">**** **** **** 1644</div>
                            <div className="pc-card-bottom">
                                <div className="pc-details">
                                    <span className="pc-label">Card Holder</span>
                                    <span className="pc-value">******</span>
                                </div>
                                <div className="pc-details">
                                    <span className="pc-label">Expiry Date</span>
                                    <span className="pc-value">09/28</span>
                                </div>
                                <div className="pc-mastercard">
                                    <div className="mc-circle"></div>
                                    <div className="mc-circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PerfectCardSection;
