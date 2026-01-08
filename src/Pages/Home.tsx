import React from 'react';

// Layout & Navigation
import Navbar from '../Components/Navbar';


// Discovery Components
import Hero from '../Components/Home components/Hero-Section';



// Trust & Value Components
import SecurityBanner from '../Components/Home components/SecurityBanner';
import Testimonials from '../Components/Home components/Testimonials';
import Neighborhoods from '../Components/Home components/Neighbourhood';
import Features from '../Components/Home components/FeaturedHostels';
import ManagerCTA from '../Components/Home components/cta';
import Footer from '../Components/Footer';
import CampusSlider from '../Components/Home components/CampusSlider';

// Action Components


const Home: React.FC = () => {
  return (
    <div className="bg-[#0B0F1A] min-h-screen flex flex-col scroll-smooth">
      {/* 1. HEADER & NAVIGATION */}
      <Navbar />

      <main>
        {/* 2. HERO: Immediate search intent */}
        <Hero />

        {/* 3. CAMPUS SLIDER: Quick university-based filtering */}
        <div className="relative z-20 -mt-10">
          <CampusSlider />
        </div>

        {/* 4. SECURITY BANNER: Establish trust before showing products */}
        <SecurityBanner />

        {/* 5. PROPERTY GRID: The main "Meat" of the page */}
        {/* <PropertyGrid /> */}

        {/* 6. NEIGHBORHOODS: Secondary discovery (Location-based) */}
        <Neighborhoods />

        {/* 7. FEATURES: Explaining the logistical value/process */}
        <Features />

        {/* 8. TESTIMONIALS: Social proof to close the deal */}
        <Testimonials />

        {/* 9. OWNER CTA: B2B onboarding for property managers */}
        <ManagerCTA />
      </main>

      {/* 10. FOOTER: Navigation and copyright */}
      <Footer />
    </div>
  );
};

export default Home;