
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

const Header = ({ title, showBackButton = false, rightElement }: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full transition-all duration-300',
      isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    )}>
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2 hover:bg-background transition-all"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          
          {!showBackButton && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-baby-blue flex items-center justify-center">
                <span className="text-primary font-bold">BT</span>
              </div>
              <span className="font-display font-semibold text-lg hidden sm:block">BabyTrack</span>
            </Link>
          )}
          
          {title && (
            <h1 className={cn(
              "text-xl font-display font-semibold transition-all",
              isScrolled ? 'opacity-100' : 'opacity-90'
            )}>
              {title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {rightElement}
          
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}
          
          {!isMobile && (
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/babies" className="text-sm font-medium hover:text-primary transition-colors">
                Meus Bebês
              </Link>
              <Link to="/vaccines" className="text-sm font-medium hover:text-primary transition-colors">
                Vacinas
              </Link>
            </nav>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-0 bg-background z-50 transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-baby-blue flex items-center justify-center">
                  <span className="text-primary font-bold">BT</span>
                </div>
                <span className="font-display font-semibold text-lg">BabyTrack</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X size={20} />
              </Button>
            </div>
            
            <nav className="flex flex-col gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-3 p-3 hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={20} />
                <span className="font-medium">Início</span>
              </Link>
              <Link 
                to="/babies" 
                className="flex items-center gap-3 p-3 hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium">Meus Bebês</span>
              </Link>
              <Link 
                to="/vaccines" 
                className="flex items-center gap-3 p-3 hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium">Vacinas</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
