import NavBar from "./NavBar";
import Hero from "./Hero";
import Funcionalidades from "./Funcionalidades";
import Preços from "./Preços";
import Contato from "./Contato";
import Footer from "./Footer";
import Testemunhos from "./Testemunhos";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
        <NavBar />
        <Hero />
        <Funcionalidades />
        <Preços />
        <Testemunhos />
        <Contato />
        <Footer />      
    </div>
  );
}
