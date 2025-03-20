
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Baby } from "@/lib/types";
import { getBabies } from "@/lib/data";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import BabyCard from "@/components/BabyCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Baby as BabyIcon, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const BabiesPage = () => {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [filteredBabies, setFilteredBabies] = useState<Baby[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadBabies = () => {
      const allBabies = getBabies();
      setBabies(allBabies);
      setFilteredBabies(allBabies);
      setIsLoading(false);
    };

    // Pequeno atraso para mostrar animações
    const timer = setTimeout(loadBabies, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBabies(babies);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = babies.filter(baby => 
      baby.name.toLowerCase().includes(query)
    );
    
    setFilteredBabies(filtered);
  }, [searchQuery, babies]);

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
      <Header 
        title="Meus Bebês" 
        showBackButton={true}
        rightElement={
          <Button asChild>
            <Link to="/baby/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo
            </Link>
          </Button>
        }
      />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <>
            {babies.length > 0 && (
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  placeholder="Buscar bebê pelo nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            
            {filteredBabies.length > 0 ? (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredBabies.map((baby) => (
                  <motion.div key={baby.id} variants={item}>
                    <BabyCard baby={baby} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState
                title={babies.length > 0 ? "Nenhum resultado encontrado" : "Nenhum bebê cadastrado"}
                description={babies.length > 0 
                  ? "Tente outro termo de busca ou adicione um novo bebê."
                  : "Comece adicionando informações do seu bebê para acompanhar seu desenvolvimento."
                }
                icon={<BabyIcon size={48} />}
                actionLabel="Adicionar Bebê"
                onAction={() => window.location.href = '/baby/new'}
                className="my-12"
              />
            )}
          </>
        )}
      </main>
    </PageTransition>
  );
};

export default BabiesPage;
