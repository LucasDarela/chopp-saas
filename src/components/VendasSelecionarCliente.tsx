// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent } from "@/components/ui/card";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Trash } from "lucide-react";

// // Definição do tipo Cliente
// interface Cliente {
//   id: number;
//   name: string;
//   tipe: string;
//   document: string;
//   phone: string;
//   address: string;
//   cep: string;
//   bairro: string;
//   city: string;
//   state: string;
//   numero: string;
//   complemento?: string;
//   email?: string;
// }