
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Baby, 
  WeightRecord, 
  HeightRecord, 
  VaccineRecord, 
  Medication,
  Vaccine
} from "@/lib/types";
import { 
  getBaby, 
  getWeightRecords, 
  getHeightRecords,
  getVaccines,
  getVaccineRecords,
  getMedications,
  deleteBaby,
  saveWeightRecord,
  saveHeightRecord,
  updateVaccineRecord,
  saveMedication
} from "@/lib/data";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import GrowthChart from "@/components/GrowthChart";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { 
  Activity, 
  CalendarCheck, 
  Edit, 
  Pill, 
  Plus, 
  Scale, 
  Trash2, 
  Ruler, 
  FilePen,
  AlertTriangle
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

const BabyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [baby, setBaby] = useState<Baby | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [heightRecords, setHeightRecords] = useState<HeightRecord[]>([]);
  const [vaccineRecords, setVaccineRecords] = useState<Array<VaccineRecord & { vaccine: Vaccine }>>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [isHeightDialogOpen, setIsHeightDialogOpen] = useState(false);
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false);
  
  const [newWeight, setNewWeight] = useState<number | "">("");
  const [newHeight, setNewHeight] = useState<number | "">("");
  const [measurementDate, setMeasurementDate] = useState<Date>(new Date());
  const [measurementNotes, setMeasurementNotes] = useState("");
  
  const [newMedication, setNewMedication] = useState({
    name: "",
    reason: "",
    dateStarted: new Date(),
    dosage: "",
    frequency: "",
    notes: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const loadData = () => {
      const babyData = getBaby(id);
      if (!babyData) {
        navigate("/babies");
        toast({
          variant: "destructive",
          title: "Bebê não encontrado",
          description: "O bebê que você está tentando acessar não existe.",
        });
        return;
      }
      
      setBaby(babyData);
      setWeightRecords(getWeightRecords(id).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setHeightRecords(getHeightRecords(id).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      
      const vaccines = getVaccines();
      const vaccineRecs = getVaccineRecords(id);
      
      // Se não houver registros de vacina para este bebê, criar registros iniciais
      if (vaccineRecs.length === 0) {
        vaccines.forEach(vaccine => {
          const vaccineRecord = {
            id: `${id}_${vaccine.id}`,
            babyId: id,
            vaccineId: vaccine.id,
            date: "",
            applied: false,
            vaccine: vaccine
          };
          vaccineRecs.push(vaccineRecord);
        });
      } else {
        // Adicionar a informação da vacina nos registros existentes
        vaccineRecs.forEach(record => {
          const vaccine = vaccines.find(v => v.id === record.vaccineId);
          if (vaccine) {
            (record as any).vaccine = vaccine;
          }
        });
      }
      
      setVaccineRecords(vaccineRecs as any);
      setMedications(getMedications(id).sort((a, b) => 
        new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime()
      ));
      
      setIsLoading(false);
    };
    
    // Pequeno atraso para mostrar animações
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [id, navigate]);

  const handleDeleteBaby = () => {
    if (!baby) return;
    
    deleteBaby(baby.id);
    toast({
      title: "Bebê removido",
      description: `As informações de ${baby.name} foram removidas.`,
    });
    navigate("/babies");
  };

  const handleAddWeight = () => {
    if (!baby || newWeight === "") return;
    
    const record = saveWeightRecord({
      babyId: baby.id,
      date: measurementDate.toISOString(),
      weight: Number(newWeight),
      notes: measurementNotes
    });
    
    setWeightRecords([record, ...weightRecords]);
    setIsWeightDialogOpen(false);
    setNewWeight("");
    setMeasurementDate(new Date());
    setMeasurementNotes("");
    
    toast({
      title: "Peso registrado",
      description: "O novo registro de peso foi adicionado com sucesso.",
    });
  };

  const handleAddHeight = () => {
    if (!baby || newHeight === "") return;
    
    const record = saveHeightRecord({
      babyId: baby.id,
      date: measurementDate.toISOString(),
      height: Number(newHeight),
      notes: measurementNotes
    });
    
    setHeightRecords([record, ...heightRecords]);
    setIsHeightDialogOpen(false);
    setNewHeight("");
    setMeasurementDate(new Date());
    setMeasurementNotes("");
    
    toast({
      title: "Altura registrada",
      description: "O novo registro de altura foi adicionado com sucesso.",
    });
  };

  const handleVaccineToggle = (record: VaccineRecord & { vaccine: Vaccine }) => {
    const updatedRecord = {
      ...record,
      applied: !record.applied,
      date: !record.applied ? new Date().toISOString() : ""
    };
    
    updateVaccineRecord(updatedRecord);
    
    setVaccineRecords(vaccineRecords.map(r => 
      r.id === record.id ? { ...updatedRecord, vaccine: r.vaccine } : r
    ));
    
    toast({
      title: record.applied ? "Vacina desmarcada" : "Vacina aplicada",
      description: `${record.vaccine.name} foi ${record.applied ? "desmarcada" : "marcada como aplicada"}.`,
    });
  };

  const handleAddMedication = () => {
    if (!baby || !newMedication.name || !newMedication.reason) return;
    
    const medication = saveMedication({
      babyId: baby.id,
      name: newMedication.name,
      reason: newMedication.reason,
      dateStarted: newMedication.dateStarted.toISOString(),
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      notes: newMedication.notes
    });
    
    setMedications([medication, ...medications]);
    setIsMedicationDialogOpen(false);
    setNewMedication({
      name: "",
      reason: "",
      dateStarted: new Date(),
      dosage: "",
      frequency: "",
      notes: ""
    });
    
    toast({
      title: "Medicamento registrado",
      description: "O novo medicamento foi adicionado com sucesso.",
    });
  };

  if (isLoading || !baby) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  const age = formatDistanceToNow(new Date(baby.birthDate), { locale: ptBR, addSuffix: false });
  const pendingVaccines = vaccineRecords.filter(record => !record.applied).length;
  
  return (
    <PageTransition>
      <Header 
        title={baby.name} 
        showBackButton={true}
        rightElement={
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-5 w-5 text-destructive/80" />
          </Button>
        }
      />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center mb-8 gap-6"
        >
          <div className={cn(
            "w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center",
            baby.gender === 'male' ? "bg-baby-blue" : 
            baby.gender === 'female' ? "bg-baby-pink" : "bg-baby-mint"
          )}>
            {baby.photo ? (
              <img 
                src={baby.photo} 
                alt={baby.name} 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {baby.name.charAt(0)}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-bold">{baby.name}</h1>
              <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                <Link to={`/baby/edit/${baby.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Idade:</span> {age}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Nascimento:</span> {format(new Date(baby.birthDate), "dd/MM/yyyy")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Gênero:</span> 
                {baby.gender === 'male' ? 'Menino' : baby.gender === 'female' ? 'Menina' : 'Outro'}
              </div>
            </div>
            
            {baby.notes && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {baby.notes}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 ml-auto mt-4 md:mt-0">
            {pendingVaccines > 0 && (
              <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {pendingVaccines} vacinas pendentes
              </Badge>
            )}
            
            {weightRecords.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                {(weightRecords[0].weight / 1000).toFixed(2)} kg
              </Badge>
            )}
            
            {heightRecords.length > 0 && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                {heightRecords[0].height} cm
              </Badge>
            )}
          </div>
        </motion.div>
        
        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="growth" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Activity className="h-4 w-4" />
              <span>Crescimento</span>
            </TabsTrigger>
            <TabsTrigger value="vaccines" className="flex items-center gap-2 data-[state=active]:bg-background">
              <CalendarCheck className="h-4 w-4" />
              <span>Vacinas</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Pill className="h-4 w-4" />
              <span>Medicamentos</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2 data-[state=active]:bg-background">
              <FilePen className="h-4 w-4" />
              <span>Notas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="growth" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="md:w-1/2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary/80" />
                      Registros de Peso
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsWeightDialogOpen(true)}
                      className="h-8 px-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  <CardDescription>
                    Acompanhe o desenvolvimento do peso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {weightRecords.length > 0 ? (
                    <div className="space-y-2">
                      {weightRecords.map((record) => (
                        <div 
                          key={record.id} 
                          className="flex items-center justify-between p-2 border-b text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {(record.weight / 1000).toFixed(2)} kg
                            </Badge>
                            <span className="text-muted-foreground">
                              {format(new Date(record.date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          {record.notes && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <FilePen className="h-3 w-3 text-muted-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="left" className="w-72">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Observações</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {record.notes}
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Nenhum registro de peso ainda.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setIsWeightDialogOpen(true)}
                        className="mt-2"
                      >
                        Adicionar primeiro registro
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:w-1/2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-primary/80" />
                      Registros de Altura
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsHeightDialogOpen(true)}
                      className="h-8 px-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  <CardDescription>
                    Acompanhe o desenvolvimento da altura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {heightRecords.length > 0 ? (
                    <div className="space-y-2">
                      {heightRecords.map((record) => (
                        <div 
                          key={record.id} 
                          className="flex items-center justify-between p-2 border-b text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {record.height} cm
                            </Badge>
                            <span className="text-muted-foreground">
                              {format(new Date(record.date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          {record.notes && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <FilePen className="h-3 w-3 text-muted-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="left" className="w-72">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Observações</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {record.notes}
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Nenhum registro de altura ainda.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setIsHeightDialogOpen(true)}
                        className="mt-2"
                      >
                        Adicionar primeiro registro
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Curva de Crescimento com referência OMS/MS */}
            <GrowthChart 
              baby={baby} 
              weightRecords={weightRecords} 
              heightRecords={heightRecords} 
            />
          </TabsContent>
          
          <TabsContent value="vaccines">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Calendário de Vacinas</CardTitle>
                <CardDescription>
                  Acompanhe as vacinas recomendadas e marque as que já foram aplicadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaccineRecords.length > 0 ? (
                    vaccineRecords.map((record) => (
                      <div 
                        key={record.id} 
                        className={cn(
                          "p-4 rounded-lg border transition-colors",
                          record.applied 
                            ? "bg-green-50 border-green-200" 
                            : "bg-card border-border"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{record.vaccine.name}</h3>
                              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                {record.vaccine.recommendedAge}
                              </Badge>
                            </div>
                            {record.vaccine.description && (
                              <p className="text-sm text-muted-foreground">
                                {record.vaccine.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {record.applied && record.date && (
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(record.date), "dd/MM/yyyy")}
                              </span>
                            )}
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`vaccine-${record.id}`}
                                checked={record.applied}
                                onCheckedChange={() => handleVaccineToggle(record)}
                              />
                              <label
                                htmlFor={`vaccine-${record.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {record.applied ? "Aplicada" : "Pendente"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Nenhuma vacina registrada.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medications">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium">Medicamentos</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsMedicationDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Medicamento
                  </Button>
                </div>
                <CardDescription>
                  Registre os medicamentos administrados ao seu bebê
                </CardDescription>
              </CardHeader>
              <CardContent>
                {medications.length > 0 ? (
                  <div className="space-y-4">
                    {medications.map((medication) => (
                      <div 
                        key={medication.id} 
                        className="p-4 rounded-lg border border-border transition-all hover:border-primary/20 hover:bg-accent/30"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <h3 className="font-medium">{medication.name}</h3>
                            <div className="flex flex-wrap gap-2 text-sm">
                              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                                {medication.reason}
                              </Badge>
                              {medication.dosage && (
                                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                  Dosagem: {medication.dosage}
                                </Badge>
                              )}
                              {medication.frequency && (
                                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                  Frequência: {medication.frequency}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm text-muted-foreground">
                              Início: {format(new Date(medication.dateStarted), "dd/MM/yyyy")}
                            </span>
                            {medication.dateEnded && (
                              <span className="text-sm text-muted-foreground">
                                Fim: {format(new Date(medication.dateEnded), "dd/MM/yyyy")}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {medication.notes && (
                          <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                            <p>{medication.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Nenhum medicamento registrado.</p>
                    <Button 
                      variant="link" 
                      onClick={() => setIsMedicationDialogOpen(true)}
                      className="mt-2"
                    >
                      Adicionar primeiro medicamento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium">Notas e Observações</CardTitle>
                <CardDescription>
                  Informações adicionais sobre {baby.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {baby.notes ? (
                  <div className="prose max-w-none">
                    <p>{baby.notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Nenhuma nota adicionada.</p>
                    <Button 
                      variant="link" 
                      asChild
                      className="mt-2"
                    >
                      <Link to={`/baby/edit/${baby.id}`}>
                        Adicionar notas
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Excluir {baby.name}?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Todos os registros relacionados a este bebê também serão excluídos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteBaby}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Adicionar Peso */}
      <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Registro de Peso</DialogTitle>
            <DialogDescription>
              Insira o peso atual de {baby.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="weight">Peso (gramas)</Label>
              <Input
                id="weight"
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 3500"
              />
              <p className="text-xs text-muted-foreground">Informe o peso em gramas (ex: 3500 = 3,5kg)</p>
            </div>
            
            <div className="grid gap-2">
              <Label>Data da Medição</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !measurementDate && "text-muted-foreground"
                    )}
                  >
                    {measurementDate ? format(measurementDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={measurementDate}
                    onSelect={(date) => date && setMeasurementDate(date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={measurementNotes}
                onChange={(e) => setMeasurementNotes(e.target.value)}
                placeholder="Alguma informação adicional sobre esta medição"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsWeightDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddWeight}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Adicionar Altura */}
      <Dialog open={isHeightDialogOpen} onOpenChange={setIsHeightDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Registro de Altura</DialogTitle>
            <DialogDescription>
              Insira a altura atual de {baby.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={newHeight}
                onChange={(e) => setNewHeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 50"
              />
              <p className="text-xs text-muted-foreground">Informe a altura em centímetros</p>
            </div>
            
            <div className="grid gap-2">
              <Label>Data da Medição</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !measurementDate && "text-muted-foreground"
                    )}
                  >
                    {measurementDate ? format(measurementDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={measurementDate}
                    onSelect={(date) => date && setMeasurementDate(date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heightNotes">Observações (opcional)</Label>
              <Textarea
                id="heightNotes"
                value={measurementNotes}
                onChange={(e) => setMeasurementNotes(e.target.value)}
                placeholder="Alguma informação adicional sobre esta medição"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsHeightDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddHeight}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Adicionar Medicamento */}
      <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Medicamento</DialogTitle>
            <DialogDescription>
              Registre informações sobre um medicamento administrado a {baby.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="medicationName">Nome do Medicamento</Label>
              <Input
                id="medicationName"
                value={newMedication.name}
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                placeholder="Ex: Paracetamol"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medicationReason">Motivo</Label>
              <Input
                id="medicationReason"
                value={newMedication.reason}
                onChange={(e) => setNewMedication({...newMedication, reason: e.target.value})}
                placeholder="Ex: Febre"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newMedication.dateStarted && "text-muted-foreground"
                    )}
                  >
                    {newMedication.dateStarted ? format(newMedication.dateStarted, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newMedication.dateStarted}
                    onSelect={(date) => date && setNewMedication({...newMedication, dateStarted: date})}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medicationDosage">Dosagem (opcional)</Label>
              <Input
                id="medicationDosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                placeholder="Ex: 5ml a cada 6 horas"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medicationFrequency">Frequência (opcional)</Label>
              <Input
                id="medicationFrequency"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                placeholder="Ex: 3 vezes ao dia"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medicationNotes">Observações (opcional)</Label>
              <Textarea
                id="medicationNotes"
                value={newMedication.notes}
                onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                placeholder="Informações adicionais sobre este medicamento"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMedicationDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddMedication}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default BabyDetailPage;
