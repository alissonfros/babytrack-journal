
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Baby } from "@/lib/types";
import { useEffect, useState } from "react";
import { getBabies } from "@/lib/data";
import BabyCard from "@/components/BabyCard";
import EmptyState from "@/components/EmptyState";
import { Plus, Baby as BabyIcon, Calendar, Activity } from "lucide-react";

const Index = () => {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pequeno atraso para simular carregamento e mostrar animações
    const timer = setTimeout(() => {
      setBabies(getBabies());
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Acompanhe o desenvolvimento do seu bebê
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto md:mx-0">
            Registre informações importantes, acompanhe o crescimento e mantenha o histórico de vacinas e medicamentos.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {babies.length > 0 ? (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-semibold">Meus Bebês</h2>
                  <Button asChild>
                    <Link to="/baby/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Bebê
                    </Link>
                  </Button>
                </div>
                
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {babies.map((baby) => (
                    <motion.div key={baby.id} variants={item}>
                      <BabyCard baby={baby} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            ) : (
              <EmptyState
                title="Nenhum bebê cadastrado"
                description="Comece adicionando informações do seu bebê para acompanhar seu desenvolvimento."
                icon={<BabyIcon size={48} />}
                actionLabel="Adicionar Bebê"
                onAction={() => window.location.href = '/baby/new'}
                className="my-12"
              />
            )}
            
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              <div className="bg-gradient-to-br from-baby-blue/20 to-transparent p-6 rounded-xl border border-baby-blue/30">
                <div className="p-3 bg-white/50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Activity className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Curvas de Crescimento</h3>
                <p className="text-muted-foreground mb-4">Acompanhe o desenvolvimento físico do seu bebê com gráficos interativos.</p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/growth">Explorar</Link>
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-baby-pink/20 to-transparent p-6 rounded-xl border border-baby-pink/30">
                <div className="p-3 bg-white/50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Calendar className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Calendário de Vacinas</h3>
                <p className="text-muted-foreground mb-4">Mantenha-se em dia com as vacinas recomendadas para cada fase.</p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/vaccines">Verificar</Link>
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-baby-mint/20 to-transparent p-6 rounded-xl border border-baby-mint/30">
                <div className="p-3 bg-white/50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <BabyIcon className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Medicamentos</h3>
                <p className="text-muted-foreground mb-4">Registre informações sobre medicamentos administrados.</p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/medications">Acessar</Link>
                </Button>
              </div>
            </motion.section>
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} BabyTrack</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
