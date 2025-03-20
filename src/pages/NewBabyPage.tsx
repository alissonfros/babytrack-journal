
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveBaby } from "@/lib/data";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  birthDate: z.date({ required_error: "A data de nascimento é obrigatória" }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Por favor, selecione o gênero",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewBabyPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simular um pequeno atraso para mostrar o estado de loading
    setTimeout(() => {
      try {
        // Salvar os dados do bebê
        const newBaby = saveBaby({
          name: data.name,
          birthDate: data.birthDate.toISOString(),
          gender: data.gender,
          notes: data.notes,
        });
        
        toast({
          title: "Bebê cadastrado com sucesso!",
          description: `As informações de ${data.name} foram salvas.`,
        });
        
        // Redirecionar para a página do bebê
        navigate(`/baby/${newBaby.id}`);
      } catch (error) {
        console.error("Erro ao salvar bebê:", error);
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar",
          description: "Ocorreu um erro ao salvar as informações. Tente novamente.",
        });
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <PageTransition>
      <Header title="Novo Bebê" showBackButton={true} />
      
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <Card className="border-border/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-baby-blue/20 to-baby-pink/20">
            <CardTitle className="text-2xl font-display">Adicionar Novo Bebê</CardTitle>
            <CardDescription>
              Preencha as informações básicas do seu bebê para começar a acompanhar seu desenvolvimento.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Bebê</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormDescription>
                        Este é o nome que será exibido em todos os registros.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={ptBR}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        A data de nascimento é usada para calcular a idade e acompanhar o desenvolvimento.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gênero</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-2"
                        >
                          <FormItem className="flex items-center space-x-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem 
                                value="male" 
                                id="male"
                                className="peer sr-only" 
                              />
                            </FormControl>
                            <label
                              htmlFor="male"
                              className={cn(
                                "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground",
                                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-baby-blue/20",
                                "cursor-pointer text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              )}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>Menino</span>
                                {field.value === "male" && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </label>
                          </FormItem>
                          
                          <FormItem className="flex items-center space-x-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem 
                                value="female" 
                                id="female"
                                className="peer sr-only" 
                              />
                            </FormControl>
                            <label
                              htmlFor="female"
                              className={cn(
                                "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground",
                                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-baby-pink/20",
                                "cursor-pointer text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              )}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>Menina</span>
                                {field.value === "female" && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </label>
                          </FormItem>
                          
                          <FormItem className="flex items-center space-x-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem 
                                value="other" 
                                id="other"
                                className="peer sr-only" 
                              />
                            </FormControl>
                            <label
                              htmlFor="other"
                              className={cn(
                                "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground",
                                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-baby-mint/20",
                                "cursor-pointer text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              )}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>Outro</span>
                                {field.value === "other" && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais (opcional)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardFooter className="px-0 pt-4 justify-end flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  );
};

export default NewBabyPage;
