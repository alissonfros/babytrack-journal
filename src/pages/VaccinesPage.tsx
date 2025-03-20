
import { useEffect, useState } from "react";
import { getVaccines } from "@/lib/data";
import { Vaccine } from "@/lib/types";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { CalendarCheck, Info, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const VaccinesPage = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [filteredVaccines, setFilteredVaccines] = useState<Vaccine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVaccines = () => {
      const allVaccines = getVaccines();
      setVaccines(allVaccines);
      setFilteredVaccines(allVaccines);
      setIsLoading(false);
    };

    // Pequeno atraso para mostrar animações
    const timer = setTimeout(loadVaccines, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVaccines(vaccines);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = vaccines.filter(vaccine => 
      vaccine.name.toLowerCase().includes(query) || 
      (vaccine.description && vaccine.description.toLowerCase().includes(query)) ||
      vaccine.recommendedAge.toLowerCase().includes(query)
    );
    
    setFilteredVaccines(filtered);
  }, [searchQuery, vaccines]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <Header title="Vacinas" showBackButton={true} />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
            <CalendarCheck className="text-primary" />
            Calendário de Vacinas
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Confira as vacinas recomendadas para o seu bebê em cada fase do desenvolvimento.
          </p>
        </motion.div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Buscar vacina por nome, descrição ou idade recomendada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Lista de Vacinas</CardTitle>
              <CardDescription>
                Vacinas recomendadas pelo calendário nacional de vacinação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4"
              >
                {filteredVaccines.length > 0 ? (
                  filteredVaccines.map((vaccine) => (
                    <motion.div 
                      key={vaccine.id} 
                      variants={item}
                      className="p-4 rounded-lg border border-border transition-all hover:border-primary/20 hover:bg-accent/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{vaccine.name}</h3>
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                              {vaccine.recommendedAge}
                            </Badge>
                            
                            {vaccine.description && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent side="top" className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">{vaccine.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {vaccine.description}
                                    </p>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                          
                          {vaccine.description && (
                            <p className="text-sm text-muted-foreground sm:hidden">
                              {vaccine.description}
                            </p>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground hidden sm:block max-w-md">
                          {vaccine.description}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Nenhuma vacina encontrada com os critérios de busca.</p>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        )}
      </main>
    </PageTransition>
  );
};

export default VaccinesPage;
