import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chopp SaaS</h1>
        <ul className="flex space-x-6">
          <li><Link href="#features">Funcionalidades</Link></li>
          <li><Link href="#pricing">Preços</Link></li>
          <li><Link href="#testimonials">Testemunhos</Link></li>
          <li><Link href="#contact">Contato</Link></li>
          <li><Link href="/auth/login">Log In</Link></li>
          <li>
            <Button asChild>
              <Link href="/auth/signup" prefetch={false}>Sign Up</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}