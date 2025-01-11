'use client';

import {
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { AlertDemo } from '@/components/toast';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useUserData } from '@/hooks/userDate';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { updateUserAction } from './action';
import { user } from './type';

export type createUser = z.infer<typeof user>;

export default function ProfilePage() {
  const { user: userData, isLoading, isError, error } = useUserData();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('');
  const queryClient = useQueryClient();
  const [alerts, setAlerts] = useState<any[]>([]);
  const canEditProfile = userData?.role === 'admin' || userData?.role === 'Owner';

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };


  useEffect(()=>{
    if(mutation.isPending){
       setLoading(true)
    }
   })

  const mutation = useMutation({
    mutationFn: (updatedUser: createUser) => {
      return updateUserAction(updatedUser).then(response => {
        return response.data;
      });
    },
    onSuccess: (updatedUser) => {
      setLoading(false)
      queryClient.setQueryData(['user'], () => [updatedUser]);
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Sucesso!', description: 'Perfil atualizado com sucesso!' }, isLoading: false },
      ]);
    },
    onError: (error) => {
      setLoading(false)
      let errorMessage = 'Ocorreu um erro ao tentar atualizar o perfil.';
      if (error instanceof Error) {
        errorMessage += ` ${error.message}`;
      }
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Erro!', description: errorMessage }, isLoading: false },
      ]);
    }
  });

  const handleSaveChanges = async (event: React.FormEvent) => {
    
    setLoading(true)

    event.preventDefault();

    if (password !== confirmPassword) {
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Erro!', description: 'As senhas não coincidem.' }, isLoading: false },
      ]);
      return;
    }
    const type = imageFile?.type.split('/')[1];
    const bucket = "avatars";
    const fileName = `${uuidv4()}.${type}`;
    
    if (imageFile) {
      const allowedImageTypes = ['image/jpeg', 'image/png'];
      if (!allowedImageTypes.includes(imageFile.type)) {
        setAlerts((prev) => [
          ...prev,
          { id: Date.now(), message: { title: 'Erro!', description: 'Tipo de imagem inválido. Apenas JPG e PNG são permitidos.' }, isLoading: false },
        ]);
        return;
      }
    
      const formData = new FormData();
      formData.append('file', imageFile);
    
      try {
        const response = await fetch(`/api/upload?bucket=${bucket}&filename=${fileName}`, {
          method: 'POST',
          body: formData,
        });
    
        if (response.status == 200) {
           setLoading(false)
          throw new Error('Falha ao carregar a imagem');
        }else { 
          setLoading(false)
          throw new Error('Falha ao carregar a imagem');
        }

      } catch (error) {
        setLoading(false)
        
        setAlerts((prev) => [
          ...prev,
          { id: Date.now(), message: { title: 'Erro ao carregar imagem', description: error.message }, isLoading: false },
        ]);
        return;

      }
    }

    const updatedUser = {
      name: name || userData?.name || '',
      email: email || userData?.email || '',
      password,
      role: role || userData?.role || '',
      image: imageFile ? `https://wmcopusctlylwfirefsm.supabase.co/storage/v1/object/public/${bucket}/${fileName}` : userData?.image || '',
    };

    console.log(updatedUser);

    try {
      user.parse(updatedUser);
      mutation.mutate(updatedUser);
    } catch (error) {
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Erro de validação!', description: 'Os dados fornecidos são inválidos.' }, isLoading: false },
      ]);
    }
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (isError) {
    return <p>Erro ao carregar os dados do usuário: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>;
  }

  return (
    <Card className="m-10">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize as informações do seu perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveChanges} className="space-y-4">
          <div className="inline-block space-y-4 flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
            <Avatar>
                {userData.image || imageFile ? (
                  <>
                    <AvatarImage src={`${imageFile ? URL.createObjectURL(imageFile) : userData?.image}`} alt={imageFile ? "Uploaded Image" : "User Image"}/>
                    <AvatarFallback>NOT FOUND</AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback>NOT FOUND</AvatarFallback>
                )}
              </Avatar>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="file-upload"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="name">Nome</Label>
            <Input
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={userData?.name ?? ''}
            />
          </div>

          <div className="space-y-4 relative">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!canEditProfile}
            />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
              {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
            </span>
          </div>

          <div className="space-y-4 relative">
            <Label htmlFor="confirm-password">Confirmar Palavra-passe</Label>
            <Input
              name="password-confirm"
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!canEditProfile}
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
              {showConfirmPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
            </span>
          </div>

          <div className="space-y-4">
            <Label htmlFor="email">E-mail</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userData?.email ?? ''}
              disabled={!canEditProfile}
            />
          </div>

          <div className="space-y-4">
           <Select onValueChange={(value) => setRole(value)} value={role}>
              <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={`Tipo de permissão: ${userData?.role}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Permissões</SelectLabel>
                  <SelectItem value="Owner">Fundador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="Anonymous">Anônimo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Separator />
          </div>
          <p className="text-[0.8rem] text-muted-foreground">
            {canEditProfile ? 'Você pode atualizar seu perfil.' : 'Você não pode atualizar seu perfil ainda.'}
          </p>
          <Button type="submit">
            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar as alterações'}
          </Button>
        </form>
      </CardContent>
      <AlertDemo alerts={alerts} />
       {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-10">
          <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-12 h-12"></div>
        </div>
      )}
    </Card>
  );
}
