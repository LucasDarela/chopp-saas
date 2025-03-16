"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AjusteConta() {
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [colaboradores, setColaboradores] = useState<{ email: string; senha: string }[]>([]);
  const [novoColaborador, setNovoColaborador] = useState<{ email: string; senha: string }>({ email: "", senha: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      
      const userData = data.user;
      setUser(userData);
      setNome(userData.user_metadata?.full_name || "");
      setEmail(userData.email || "");
      if (userData.user_metadata?.avatar_url) {
        setImagemPreview(userData.user_metadata.avatar_url);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Alterar Nome de Usuário
  const handleAlterarNome = async () => {
    if (!user) return;
    const { error } = await supabase.auth.updateUser({
      data: { full_name: nome },
    });
    if (error) {
      toast.error("Erro ao atualizar nome.");
    } else {
      toast.success("Nome atualizado com sucesso!");
    }
  };

  // 🔹 Alterar Email
  const handleAlterarEmail = async () => {
    if (!user) return;
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      toast.error("Erro ao atualizar email.");
    } else {
      toast.success("Email atualizado! Confirme no seu email.");
    }
  };

  // 🔹 Redefinir Senha
  const handleRedefinirSenha = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast.error("Erro ao enviar email de redefinição.");
    } else {
      toast.success("Email de redefinição de senha enviado!");
    }
  };

  const handleImagemChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 150;
        canvas.height = 150;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob(async (blob) => {
          if (blob) {
            const fileName = `avatar_${user.id}.webp`;
  
            // 🔹 **Exclui a imagem antiga antes de fazer upload**
            await supabase.storage.from("avatars").remove([fileName]);
  
            // 🔹 **Faz o upload da nova imagem**
            const { data, error } = await supabase.storage.from("avatars").upload(fileName, blob, {
              cacheControl: "3600",
              upsert: true,
            });
  
            if (error) {
              toast.error("Erro ao enviar imagem.");
            } else {
              const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
  
              // 🔹 **Atualiza o perfil do usuário com o novo avatar**
              const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicURL },
              });
  
              if (updateError) {
                toast.error("Erro ao atualizar perfil.");
              } else {
                // 🔹 **Força atualização limpando o cache do navegador**
                setImagemPreview(`${publicURL}?t=${new Date().getTime()}`);
  
                setUser((prev: any) => ({
                  ...prev,
                  user_metadata: { ...prev.user_metadata, avatar_url: publicURL },
                }));
  
                toast.success("Imagem de perfil atualizada!");
              }
            }
          }
        }, "image/webp");
      };
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Adicionar Colaborador
  const handleAdicionarColaborador = async () => {
    if (!novoColaborador.email || !novoColaborador.senha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: novoColaborador.email,
      password: novoColaborador.senha,
    });

    if (error) {
      toast.error("Erro ao adicionar colaborador.");
    } else {
      toast.success("Colaborador adicionado com sucesso!");
      setColaboradores([...colaboradores, novoColaborador]);
      setNovoColaborador({ email: "", senha: "" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Ajustes da Conta</h1>

      {/* 🔹 Foto de Perfil */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center p-6">
          
          <label htmlFor="imagemUpload" className="cursor-pointer">
            {imagemPreview ? (
              <Avatar className="h-20 w-20">
        <AvatarImage src={imagemPreview || "https://via.placeholder.com/150"} alt="Avatar" />
        <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-20 w-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <span className="text-gray-500">Alterar</span>
                
              </div>
            )}
          </label>
          <input type="file" id="imagemUpload" accept="image/*" className="hidden" onChange={handleImagemChange} />
        </CardContent>
      </Card>

      {/* 🔹 Informações do Usuário */}
      <Card className="mb-6">
        <CardContent className="space-y-4 space-x-4">

          <Input type="text" placeholder="Nome de Usuário" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Button onClick={handleAlterarNome}>Alterar Nome</Button>

          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleAlterarEmail}>Alterar Email</Button>

          <Button onClick={handleRedefinirSenha} variant="destructive">
            Redefinir Senha
          </Button>
        </CardContent>
      </Card>

      {/* 🔹 Gerenciamento de Equipe */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Gerenciar Equipe</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="email"
              placeholder="Email do Colaborador"
              value={novoColaborador.email}
              onChange={(e) => setNovoColaborador({ ...novoColaborador, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={novoColaborador.senha}
              onChange={(e) => setNovoColaborador({ ...novoColaborador, senha: e.target.value })}
            />
          </div>
          <Button onClick={handleAdicionarColaborador}>Adicionar Colaborador</Button>
          <div className="mt-4">
            {colaboradores.map((colab, index) => (
              <p key={index} className="text-sm text-gray-700">{colab.email}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}