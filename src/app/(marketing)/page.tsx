"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import logoWh from '@/app/assets/logo-wh.webp';
import Image from "next/image";
import Planos from "./sections/Planos";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };
    // Função para fazer a rolagem suave até a seção correspondente
    const handleScroll = (
      event: React.MouseEvent<HTMLAnchorElement>,
      targetId: string
    ) => {
      event.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: (targetElement as HTMLElement).offsetTop - 80, // Ajuste de deslocamento
          behavior: "smooth",
        });
      }
    };

  return (
    <div>
        {/* Navbar Responsiva */}
        <nav className="bg-white shadow-md p-4 flex items-center z-50 relative">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Chopp SaaS</h1>

          {/* Links Centralizados */}
          <ul className="hidden md:flex flex-1 justify-center space-x-6">
            <li><Link href="#features">Funcionalidades</Link></li>
            <li><Link href="#pricing">Preços</Link></li>
            <li><Link href="#testimonials">Clientes</Link></li>
            <li><Link href="#contact">Contato</Link></li>
          </ul>

          {/* Botões à Direita */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Button asChild className="px-4 py-2 text-white rounded-md hover:bg-blue-700">
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild className="px-4 py-2 text-white rounded-md hover:bg-blue-700">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden ml-auto">
            <Button variant="ghost" onClick={toggleMenu}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </nav>
      
      {/* Menu Mobile */}
      {menuOpen && (
        <ul className="md:hidden bg-white shadow-md absolute w-full flex flex-col items-center p-4 space-y-4 z-10">
          <li><Link href="#features" onClick={toggleMenu}>Funcionalidades</Link></li>
          <li><Link href="#pricing" onClick={toggleMenu}>Preços</Link></li>
          <li><Link href="#testimonials" onClick={toggleMenu}>Clientes</Link></li>
          <li><Link href="#contact" onClick={toggleMenu}>Contato</Link></li>
          <li>
            <Button asChild className="hover:bg-blue-700">
              <Link href="/auth/login" onClick={toggleMenu}>Log In</Link>
            </Button>
          </li>
          <li>
            <Button asChild className="hover:bg-blue-700">
              <Link href="/auth/signup" onClick={toggleMenu}>Sign Up</Link>
            </Button>
          </li>
        </ul>
      )}
      
      {/* Hero com Carrossel */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <Slider {...sliderSettings} className="max-w-4xl mx-auto">
          <div className="p-10">
            <h2 className="text-4xl font-bold">Sitema Responsivo para sua Distribuidora</h2>
            <p className="mt-4 text-lg">Gerencia suas vendas através do Celular ou Computador.</p>
            <Button asChild className="mt-6">
              <Link href="/auth/signup">Experimente Agora</Link>
            </Button>
          </div>
          <div className="p-10">
            <h2 className="text-4xl font-bold">Controle Total do Seu Negócio</h2>
            <p className="mt-4 text-lg">Monitore vendas, estoque e clientes em tempo real.</p>
          </div>
          <div className="p-10">
            <h2 className="text-4xl font-bold">Facilidade e Agilidade nas Entregas</h2>
            <p className="mt-4 text-lg">Otimize seu tempo com um sistema de entregas eficiente.</p>
          </div>
        </Slider>
      </section>

      {/* Funcionalidades */}
      <section id="features" className="py-20 text-center">
        <h2 className="text-3xl font-bold">Principais Funcionalidades</h2>
        <p className="mt-2 text-gray-600">Tudo o que você precisa para gerenciar sua distribuidora.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 px-6">
          {["Gestão de Pedidos", "Controle de Estoque", "Agendamento de Entregas"].map((title, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-gray-600">Descrição breve sobre a funcionalidade.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Planos />


      {/* Preços */}
      {/* <section id="pricing" className="py-20 text-center bg-gray-100">
        <h2 className="text-3xl font-bold">Planos e Preços</h2>
        <p className="mt-2 text-gray-600">Escolha o plano ideal para o seu negócio.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 px-6 max-w-5xl mx-auto"> */}
          {/* Plano Platinum */}
          {/* <Card className="border border-gray-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-blue-700">Platinum</h3>
              <p className="text-gray-600 mt-2">Teste 7 dias depois <strong>R$300/mês</strong></p>
              <ul className="text-gray-500 mt-4 space-y-2">
                <li>✅ 1 usuário apenas</li>
                <li>🚫 Agendamento de entrega bloqueado</li>
              </ul>
              <Button className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700">
                Assinar Plano
              </Button>
            </CardContent>
          </Card> */}

          {/* Plano Gold */}
          {/* <Card className="border border-gray-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-yellow-600">Gold</h3>
              <p className="text-gray-600 mt-2"><strong>R$500/mês</strong></p>
              <ul className="text-gray-500 mt-4 space-y-2">
                <li>✅ Todas as funções habilitadas</li>
                <li>✅ Apenas 1 usuário logado por vez</li>
              </ul>
              <Button className="mt-6 w-full bg-yellow-600 text-white hover:bg-yellow-700">
                Assinar Plano
              </Button>
            </CardContent>
          </Card> */}

          {/* Plano Premium */}
          {/* <Card className="border border-gray-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-green-700">Premium</h3>
              <p className="text-gray-600 mt-2"><strong>R$800/mês</strong></p>
              <ul className="text-gray-500 mt-4 space-y-2">
                <li>✅ Suporte prioritário</li>
                <li>✅ Todas as funcionalidades</li>
                <li>✅ Até 5 usuários logados</li>
                <li>ℹ️ Para mais usuários, entre em contato</li>
              </ul>
              <Button className="mt-6 w-full bg-green-600 text-white hover:bg-green-700">
                Assinar Plano
              </Button>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Testemunhos */}
      <section id="testimonials" className="py-20 text-center">
        <h2 className="text-3xl font-bold">O que Nossos Clientes Dizem</h2>
        <p className="mt-2 text-gray-600">Depoimentos de clientes satisfeitos.</p>
      </section>

      {/* Contato */}
      <section id="contact" className="py-20 text-center bg-gray-200">
        <h2 className="text-3xl font-bold">Entre em Contato</h2>
        <p className="mt-2 text-gray-600">Dúvidas? Fale com nossa equipe.</p>
      </section>

      {/* Footer */}
      <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center z-10">
      <div className="container mx-auto">
        <div className="inline-flex relative">
          <Image
            src={logoWh}
            alt="Darela Chopp Logomarca"
            height={40}
            className="relative"
          />
        </div>

        {/* Links de navegação com rolagem suave */}
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a
            href="#funcionalidades"
            className="hover:text-blue-700"
            onClick={(e) => handleScroll(e, "#funcionalidades")}
          >
            Funcionalidades
          </a>
          <a
            href="#precos"
            className="hover:text-blue-700"
            onClick={(e) => handleScroll(e, "#precos")}
          >
            Preços
          </a>
          <a
            href="#testemunhos"
            className="hover:text-blue-700"
            onClick={(e) => handleScroll(e, "#testemunhos")}
          >
            Clientes
          </a>
          <a
            href="#contato"
            className="hover:text-blue-700"
            onClick={(e) => handleScroll(e, "#contato")}
          >
            Contato
          </a>
        </nav>

        <div className="flex flex-col items-center gap-6 mt-6">
          <p className="mt-6">
            © 2025 Neotech X. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
    </div>
  );
}