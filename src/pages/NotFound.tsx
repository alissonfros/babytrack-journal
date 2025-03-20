
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent/20 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="text-6xl font-bold">?</span>
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Página não encontrada
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
