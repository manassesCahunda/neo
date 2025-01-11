'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/commad"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CurrencyInput from 'react-currency-input-field'; 
import { querTeams, createTeams } from "@/action/queryTeams";
import { Loader2 } from 'lucide-react';

type Team = {
  label: string;
  value: string;
};

interface TeamSwitcherProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {}

const intlConfig = {
  locale: 'en-US',
  currency: 'USD',
};

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [groups, setGroups] = useState([{ label: "Teams", teams: [] }]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [currentValue, setCurrentValue] = useState<string | undefined>();
  const [feedbackMessage, setFeedbackMessage] = useState<{ message: string; success: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    async function fetchTeams() {
      try {
        const teamsData = await querTeams();
        const formattedGroups =
          teamsData.length === 0
            ? [
                {
                  label: "Nenhuma equipa",
                  teams: [
                    {
                      label: "Nenhuma equipa",
                      value: "no_team",
                    },
                  ],
                },
              ]
            : [
                {
                  label: "Teams",
                  teams: teamsData.map((team) => ({
                    label: team.name,
                    value: team.amount,
                  })),
                },
              ];

        setGroups(formattedGroups);
        setSelectedTeam(formattedGroups[0]?.teams[0] || null);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    }

    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    
    setIsLoading(true);

    console.log("orcamento");
    console.log(newTeamName);
    console.log(currentValue);

    // try {
    //   const amountString = currentValue || ""; 

    //   if (!amountString) {
    //     throw new Error("O campo 'amount' é obrigatório.");
    //   }
  
    //   await createTeams({ name: newTeamName, amount: amountString });
    //   setFeedbackMessage({ message: "Equipe criada com sucesso!", success: true });
    //   setShowNewTeamDialog(false);
    //   setNewTeamName("");
    //   setCurrentValue(undefined); 
    //   fetchTeams();
    // } catch (error) {
    //   console.error("Error creating team:", error);
    //   setFeedbackMessage({ message: error.message || "Erro ao criar a equipe.", success: false });
    // } finally {
    //   setIsLoading(false);
    // }
  };
  
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam?.value}.png`}
                alt={selectedTeam?.label || "Team"}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam?.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search team..." />
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam?.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipa</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Orçamento</Label>
              <br/>
              <CurrencyInput
                id="amount"
                className="text-black dark:text-white"
                placeholder="$1,234,567"
                allowDecimals={true}
                decimalsLimit={6}
                prefix={'$'}
                intlConfig={intlConfig}
                step={10}
                onValueChange={(value) => setCurrentValue(value)}
              />
            </div>
          </div>
        </div>
        {feedbackMessage && (
          <p
            className={`mt-2 text-sm ${
              feedbackMessage.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {feedbackMessage.message}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateTeam} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
