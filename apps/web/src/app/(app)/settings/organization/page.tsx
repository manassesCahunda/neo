'use client';

import {
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
  SelectTrigger,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUserData } from '@/hooks/userDate';
import {
  app,
  doc,
  getFirestore,
  onSnapshot,
} from '@neo/firebase';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  queryCompany,
  updateCompany,
} from './actions';
import { DialogDemo } from './provider/page';
import { updateCompanySchema } from './type';

const db = getFirestore(app);

export default function OrganizationPage() {
  const { user: userData, isLoading: userLoading, isError: userError, error: userErrorData } = useUserData();
  const canEditProfile = userData?.role === 'admin' || userData?.role === 'Owner';

  const [qrcode, setQrcode] = useState<string>('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [host, setHost] = useState('');
  const [key, setKey] = useState('');
  const [xauth, setXauth] = useState('');
  const [alerts, setAlerts] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if( mutation.isPending == true){
        setLoading(true)
      }
      else{
      setLoading(false)
      }
   })


  const { data, error: queryError, isLoading: queryLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => {
      const email = userData?.email;
      if (!email) {
        return Promise.reject(new Error('Email é necessário.'));
      }
      return queryCompany({ email }).then((response) => response);
    },
  });

  useEffect(() => {

    const unsubscribe = onSnapshot(doc(db, "qrcode", "unique"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const code = data?.qrcode;
        if (typeof code === 'string') {
          setQrcode(code); 
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const mutation = useMutation({
    mutationFn: (updatedUser: any) => {
      return updateCompany(updatedUser).then((response) => response);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['company'], () => [updatedUser]);
      queryClient.invalidateQueries(['company']);
      showAlert({ title: 'Sucesso!', description: 'Perfil atualizado com sucesso!' });
    },
    onError: (error) => {
      let errorMessage = 'Ocorreu um erro ao tentar atualizar o perfil.';
    
      if (error instanceof Error) {
        errorMessage += ` ${error.message}`;
      } else if (typeof error === 'object' && error?.message) {
        errorMessage += ` ${error.message}`;
      }
  
      showAlert({ title: 'Erro!', description: errorMessage }, 'error');
    },
  });

  const companyData = data?.[0] || {};

  const showAlert = (message: { title: string; description: string }, type: 'success' | 'error' = 'success') => {
    setAlerts((prev) => [
      ...prev,
      { id: Date.now(), message, isLoading: false, type },
    ]);
  };

  const handleSaveChangesAction = async (event: React.FormEvent) => {
    event.preventDefault();

    if (domain) {
      const updateDomain = domain && domain.includes('@') ? domain.split('@')[1]?.split('.')[0] : undefined;
      const companyDomain = companyData?.domain && companyData?.domain.includes('@') ? companyData?.domain.split('@')[1]?.split('.')[0] : undefined;
      
   if (updateDomain != companyDomain) {
        showAlert({ title: 'Erro!', description: 'Os domínios Não são iguais.' }, 'error');
        return;
      }
    }
    
    const updatedUser = {
      id: companyData?.id || '',
      name: name || companyData?.name || '',
      domain: domain || companyData?.domain || '',
      key: key || companyData?.externalApiKey?.key || '',
      host: host || companyData?.externalApiKey?.host || '',
      xauth: xauth || companyData?.externalApiKey?.xauth || '',
      externalId: domain && domain.includes('@') ? domain.split('@')[1]?.split('.')[0] : (companyData?.domain && companyData?.domain.includes('@') ? companyData?.domain.split('@')[1]?.split('.')[0] : ''),
    };

    updateCompanySchema.parse(updatedUser);

    try {
      mutation.mutate(updatedUser);
      setLoading(true)
    } catch (error) {
      showAlert({ title: 'Erro de validação!', description: 'Os dados fornecidos são inválidos.' }, 'error');
      setLoading(false)
    }
  };

  if (userLoading || queryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (userError || queryError) {
    return <div>Error loading data: {userErrorData?.message || queryError?.message}</div>;
  }

  const members = Array.isArray(companyData.members) ? companyData.members : [companyData.members];


  return (
    <div className="flex m-10">
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Organização</CardTitle>
          <CardDescription>Atualize as informações da sua organização.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChangesAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={companyData?.name || 'Nome da Organização'}
                disabled={!canEditProfile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domínio</Label>
              <Input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder={companyData?.domain || 'name@empresa.com'}
                disabled={!canEditProfile}
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Todos os usuários que se autenticarem com este domínio serão automaticamente
                adicionados à sua organização.
              </p>
            </div>

            <br />
            
            <Label 
              htmlFor="host" 
              style={{ color: companyData?.externalApiKey?.connect ? 'green' : 'red' }}
            >
              {companyData?.externalApiKey?.connect 
                ? "Conectado ao servidor de email" 
                : "Erro de conexão"}
            </Label>

            <div className="space-y-2">
              <Label htmlFor="host">Host (endereço de servidor de email)</Label>
              <Input
                type="text"
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder={companyData?.externalApiKey?.host || 'imap.mail.com'}
                disabled={!canEditProfile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Chave de acesso</Label>
              <Input
                type="password"
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={companyData?.externalApiKey?.key || '4rur rrre ereyw'}
                disabled={!canEditProfile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth">Token de Qauth(2.0) ou Xauth(2)</Label>
              <br />
              <Label className="text-red-500" htmlFor="auth">Em breve, autenticação via caixa de entrada de email estará disponível</Label>
              <Input
                type="text"
                id="auth"
                value={xauth}
                onChange={(e) => setXauth(e.target.value)}
                placeholder={companyData?.externalApiKey?.xauth || 'access_token'}
                disabled
              />
            </div>
            <Separator />
              <Button type="submit" disabled={loading} className="mr-10">
                {loading ? <Loader2 className="animate-spin" /> : 'Confirmar as alterações'}
              </Button>
              <DialogDemo  userProvider={userData?.email} companyName={companyData?.name} companyId={companyData?.id}/>

            <Separator />
            <div className="space-y-2">
              <Label>Membros</Label>
              <div className="rounded border">
                {queryLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Avatar</TableHead>
                        <TableHead>Nome do membro</TableHead>
                        <TableHead>Contato de email</TableHead>
                        <TableHead className="text-right">Nível de permissões</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.length > 0 ? (
                        members.map((member) => (
                          <TableRow key={member?.id}>
                            <TableCell style={{ width: 48 }}>
                              {member?.image ? (
                                <Avatar>
                                  <AvatarImage src={member?.image} alt={member?.name || 'Avatar'} />
                                  <AvatarFallback>{member?.name ? member?.name[0] : 'N/A'}</AvatarFallback>
                                </Avatar>
                              ) : (
                                <Avatar>
                                  <AvatarFallback>{member?.name ? member?.name[0] : 'N/A'}</AvatarFallback>
                                </Avatar>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              <span className="font-medium text-primary">{member?.name}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-muted-foreground">{member?.email}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select disabled>
                                <SelectTrigger>{member?.role}</SelectTrigger>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            Nenhum membro encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
            <Separator />
              <p className="text-[0.8rem] text-muted-foreground">
                {canEditProfile
                  ? `Você pode atualizar o perfil da sua organização porque o seu nível de permissões é: ${userData?.role}.`
                  : `Você não pode atualizar o perfil da sua organização porque o seu nível de permissões é: ${userData?.role}.` }
              </p>
          </form>
        </CardContent>
        <AlertDemo alerts={alerts} />
      </Card>
        <div className="w-[350px] h-[300px] flex justify-center items-center pl-10">
        <div className='w-full h-full p-2 dark:bg-white'>
          {canEditProfile ?
            ( 
              <QRCodeSVG value={qrcode} className="w-full h-full" />
            ) : "Não possue permissão "
          }
        </div>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-10">
          <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-12 h-12"></div>
        </div>
      )}
    </div>
  );
}
