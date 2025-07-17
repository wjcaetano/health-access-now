
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X } from "lucide-react";

export default function UploadFotoPerfil() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFoto = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    // Remove foto anterior se existir
    if (profile?.foto_url) {
      await supabase.storage
        .from('profile-pictures')
        .remove([`${user.id}/avatar.${profile.foto_url.split('.').pop()}`]);
    }

    // Upload nova foto
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleUpload = async () => {
    const fileInput = document.getElementById('foto-input') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    
    if (!file) {
      toast({
        title: "Erro",
        description: "Selecione uma foto primeiro",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fotoUrl = await uploadFoto(file);
      
      if (fotoUrl) {
        await updateProfile({ foto_url: fotoUrl });
        toast({
          title: "Sucesso",
          description: "Foto de perfil atualizada",
        });
        setPreview(null);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da foto",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFoto = async () => {
    if (!user || !profile?.foto_url) return;

    try {
      // Remove do storage
      const fileName = profile.foto_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`${user.id}/${fileName}`]);
      }

      // Remove do perfil
      await updateProfile({ foto_url: null });
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil removida",
      });
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Foto de Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={preview || profile?.foto_url || undefined} 
              alt="Foto de perfil" 
            />
            <AvatarFallback className="text-lg">
              {profile?.nome?.charAt(0) || user?.email?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2">
          <input
            id="foto-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById('foto-input')?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Foto
            </Button>
            
            {preview && (
              <Button 
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? "Enviando..." : "Salvar"}
              </Button>
            )}
          </div>

          {profile?.foto_url && (
            <Button
              variant="destructive"
              onClick={handleRemoveFoto}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Remover Foto
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
