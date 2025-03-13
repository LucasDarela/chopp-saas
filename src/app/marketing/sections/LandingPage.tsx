import React from 'react';
import Navbar from "../../(marketing)/sections/NavBar";
import Hero from "../../(marketing)/sections/Hero";
import Funcionalidades from "../../(marketing)/sections/Funcionalidades";
import Preços from "../../(marketing)/sections/Preços";
import Testemunhos from "../../(marketing)/sections/Testemunhos";
import Contato from "../../(marketing)/sections/Contato";
import Footer from "../../(marketing)/sections/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <Funcionalidades />
      <Preços />
      <Testemunhos />
      <Contato />
      <Footer />
    </div>
  );
}