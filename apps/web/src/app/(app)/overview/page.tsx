// "use client"

// import * as React from "react"
// import { ChevronsUpDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"

// export default function Overview() {
//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="w-[600px] h-[500px] overflow-auto">
//         <Collapsible type="single" collapsible className="w-full h-full">
          
//           {/* Visão Geral do Projeto */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between space-x-4 px-4">
//               <h4 className="text-sm font-semibold">
//                 Visão Geral do Projeto
//               </h4>
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="w-9 p-0">
//                   <ChevronsUpDown className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//             </div>
//             <CollapsibleContent>
//               <div className="rounded-md border px-4 py-3 font-mono text-sm">
//                 Em breve, você poderá criar e gerenciar seus projetos de forma completa. A funcionalidade de **Visão Geral** permitirá que você tenha uma visão centralizada e interativa do seu projeto, facilitando a criação de um plano financeiro detalhado para cada projeto. As equipes poderão definir metas e prazos, e a ferramenta irá calcular e ajustar o orçamento conforme necessário. Além disso, será possível gerenciar o orçamento diretamente através da conexão com sua conta bancária, permitindo um controle financeiro mais eficiente e dinâmico.
//               </div>
//             </CollapsibleContent>
//           </div>

//           {/* Criar Projetos e Gerenciar Equipes */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between space-x-4 px-4">
//               <h4 className="text-sm font-semibold">
//                 Criar Projetos e Gerenciar Equipes
//               </h4>
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="w-9 p-0">
//                   <ChevronsUpDown className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//             </div>
//             <CollapsibleContent>
//               <div className="rounded-md border px-4 py-3 font-mono text-sm">
//                 A funcionalidade de **Criar Projetos e Gerenciar Equipes** permitirá que você:
//                 <ul>
//                   <li>Crie novos projetos com informações detalhadas, como nome, objetivos e prazos.</li>
//                   <li>Gerencie equipes, atribuindo membros e responsabilidades específicas dentro do projeto.</li>
//                 </ul>
//               </div>
//             </CollapsibleContent>
//           </div>

//           {/* Definir e Ajustar o Orçamento */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between space-x-4 px-4">
//               <h4 className="text-sm font-semibold">
//                 Definir e Ajustar o Orçamento
//               </h4>
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="w-9 p-0">
//                   <ChevronsUpDown className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//             </div>
//             <CollapsibleContent>
//               <div className="rounded-md border px-4 py-3 font-mono text-sm">
//                 A funcionalidade de **Definir e Ajustar o Orçamento** permitirá que você:
//                 <ul>
//                   <li>Estabeleça um orçamento inicial para cada projeto.</li>
//                   <li>Ajuste o orçamento conforme o andamento do projeto, aumentando ou diminuindo os valores conforme necessário.</li>
//                 </ul>
//               </div>
//             </CollapsibleContent>
//           </div>

//           {/* Acompanhar Gastos e Transações */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between space-x-4 px-4">
//               <h4 className="text-sm font-semibold">
//                 Acompanhar Gastos e Transações
//               </h4>
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="w-9 p-0">
//                   <ChevronsUpDown className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//             </div>
//             <CollapsibleContent>
//               <div className="rounded-md border px-4 py-3 font-mono text-sm">
//                 A funcionalidade de **Acompanhar Gastos e Transações** permitirá que você:
//                 <ul>
//                   <li>Tenha acesso a todos os comprovantes de gastos e transações realizadas dentro do projeto.</li>
//                   <li>Mantenha registros claros e organizados para facilitar a visualização e auditoria.</li>
//                 </ul>
//               </div>
//             </CollapsibleContent>
//           </div>

//           {/* Ajustar Orçamento para os Próximos Meses */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between space-x-4 px-4">
//               <h4 className="text-sm font-semibold">
//                 Ajustar Orçamento para os Próximos Meses
//               </h4>
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="w-9 p-0">
//                   <ChevronsUpDown className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//             </div>
//             <CollapsibleContent>
//               <div className="rounded-md border px-4 py-3 font-mono text-sm">
//                 A funcionalidade de **Ajustar Orçamento para os Próximos Meses** permitirá que você:
//                 <ul>
//                   <li>Defina uma linha de redução ou aumento do orçamento para os próximos 2 a 3 meses, com base no progresso do projeto.</li>
//                   <li>Ajuste os custos, garantindo que o orçamento esteja alinhado com o andamento das atividades do projeto.</li>
//                 </ul>
//               </div>
//             </CollapsibleContent>
//           </div>

//           {/* Acompanhar Lucros e Perdas */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between space-x-4 px-4">
//               <h4 className="text-sm font-semibold">
//                 Acompanhar Lucros e Perdas
//               </h4>
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="w-9 p-0">
//                   <ChevronsUpDown className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//             </div>
//             <CollapsibleContent>
//               <div className="rounded-md border px-4 py-3 font-mono text-sm">
//                 A funcionalidade de **Acompanhar Lucros e Perdas** permitirá que você:
//                 <ul>
//                   <li>Acompanhe os lucros e perdas em tempo real, com uma visão clara do estado financeiro do projeto.</li>
//                   <li>Analise as métricas financeiras para tomar decisões informadas sobre o futuro do projeto.</li>
//                 </ul>
//               </div>
//             </CollapsibleContent>
//           </div>

//           {/* Data de Lançamento */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between space-x-4 px-4">
//               <h4 className="text-sm font-semibold">
//                 Data de Lançamento
//               </h4>
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="sm" className="w-9 p-0">
//                   <ChevronsUpDown className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//             </div>
//             <CollapsibleContent>
//               <div className="rounded-md border px-4 py-3 font-mono text-sm">
//                 A funcionalidade **Visão Geral** será lançada em breve. Ela trará uma forma prática e acessível de gerenciar seus projetos, monitorando o orçamento, os gastos e as transações, com uma interface interativa que permitirá ajustes em tempo real e um controle total sobre as finanças do projeto.
//               </div>
//             </CollapsibleContent>
//           </div>
//         </Collapsible>
//       </div>
//     </div>
//   )
// }



import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AlertDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Alert className="max-w-md w-full">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Em Breve!</AlertTitle>
        <AlertDescription>
          Estamos desenvolvendo uma ferramenta de gestão de
          <br />
          orçamentos de projetos e equipes,  com integração 
          <br />
          para controle financeiro e ajustes de valores ao longo 
          <br />
          do tempo em contas bancarias angolanas.
        </AlertDescription>
      </Alert>
    </div>
  )
}