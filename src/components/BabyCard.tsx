
import { Baby } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface BabyCardProps {
  baby: Baby;
  className?: string;
}

const BabyCard = ({ baby, className }: BabyCardProps) => {
  const navigate = useNavigate();
  const age = formatDistanceToNow(new Date(baby.birthDate), { locale: ptBR, addSuffix: false });
  
  const getGradientClass = () => {
    if (baby.gender === 'male') return 'from-baby-blue/30 to-transparent';
    if (baby.gender === 'female') return 'from-baby-pink/30 to-transparent';
    return 'from-baby-mint/30 to-transparent';
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden card-hover cursor-pointer border-border/30",
        className
      )}
      onClick={() => navigate(`/baby/${baby.id}`)}
    >
      <div className={cn(
        "h-2 w-full",
        baby.gender === 'male' ? "bg-baby-blue" : 
        baby.gender === 'female' ? "bg-baby-pink" : "bg-baby-mint"
      )} />
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex-shrink-0 bg-gradient-to-b",
            getGradientClass()
          )}>
            {baby.photo ? (
              <img 
                src={baby.photo} 
                alt={baby.name} 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-primary">
                {baby.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{baby.name}</h3>
            <p className="text-sm text-muted-foreground">{age} de idade</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BabyCard;
