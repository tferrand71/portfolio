import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

export default function Home() {
    return (
        <main className="bg-rich-black text-white">
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <FeaturedProjects />
            <Education />
            <Contact />
        </main>
    );
}