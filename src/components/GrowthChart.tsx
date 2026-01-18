import { useMemo } from "react";
import {
  Area,
  ComposedChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  GrowthDataPoint,
  weightForAgeBoys,
  weightForAgeGirls,
  heightForAgeBoys,
  heightForAgeGirls,
  calculateAgeInMonths,
  getPercentileRange,
  getPercentileColor,
} from "@/lib/growthStandards";
import { WeightRecord, HeightRecord, Baby } from "@/lib/types";
import { Scale, Ruler, TrendingUp, Info } from "lucide-react";
import { motion } from "framer-motion";

interface GrowthChartProps {
  baby: Baby;
  weightRecords: WeightRecord[];
  heightRecords: HeightRecord[];
}

interface ChartDataPoint {
  month: number;
  label: string;
  P3: number;
  P15: number;
  P50: number;
  P85: number;
  P97: number;
  babyValue?: number;
  babyLabel?: string;
}

const GrowthChart = ({ baby, weightRecords, heightRecords }: GrowthChartProps) => {
  const isBoy = baby.gender === "male";

  const weightStandards = isBoy ? weightForAgeBoys : weightForAgeGirls;
  const heightStandards = isBoy ? heightForAgeBoys : heightForAgeGirls;

  // Preparar dados do gráfico de peso
  const weightChartData = useMemo(() => {
    const data: ChartDataPoint[] = weightStandards.map((standard) => ({
      month: standard.month,
      label: `${standard.month}m`,
      P3: standard.P3,
      P15: standard.P15,
      P50: standard.P50,
      P85: standard.P85,
      P97: standard.P97,
    }));

    // Adicionar pontos do bebê
    weightRecords.forEach((record) => {
      const ageInMonths = calculateAgeInMonths(baby.birthDate, record.date);
      const weightInKg = record.weight / 1000;
      const roundedMonth = Math.round(ageInMonths);
      
      // Encontrar ou criar ponto no mês correspondente
      const existingPoint = data.find((d) => d.month === roundedMonth);
      if (existingPoint) {
        existingPoint.babyValue = weightInKg;
        existingPoint.babyLabel = `${weightInKg.toFixed(2)} kg`;
      } else if (roundedMonth >= 0 && roundedMonth <= 24) {
        // Interpolar valores de referência para este mês
        const floorMonth = Math.floor(ageInMonths);
        const ceilMonth = Math.ceil(ageInMonths);
        const safeFloor = Math.min(Math.max(floorMonth, 0), weightStandards.length - 1);
        const safeCeil = Math.min(Math.max(ceilMonth, 0), weightStandards.length - 1);
        const ratio = ageInMonths - floorMonth;
        
        const interpolate = (key: keyof GrowthDataPoint) => {
          return (weightStandards[safeFloor][key] as number) * (1 - ratio) + 
                 (weightStandards[safeCeil][key] as number) * ratio;
        };

        data.push({
          month: roundedMonth,
          label: `${roundedMonth}m`,
          P3: interpolate('P3'),
          P15: interpolate('P15'),
          P50: interpolate('P50'),
          P85: interpolate('P85'),
          P97: interpolate('P97'),
          babyValue: weightInKg,
          babyLabel: `${weightInKg.toFixed(2)} kg`,
        });
      }
    });

    return data.sort((a, b) => a.month - b.month);
  }, [weightRecords, weightStandards, baby.birthDate]);

  // Preparar dados do gráfico de altura
  const heightChartData = useMemo(() => {
    const data: ChartDataPoint[] = heightStandards.map((standard) => ({
      month: standard.month,
      label: `${standard.month}m`,
      P3: standard.P3,
      P15: standard.P15,
      P50: standard.P50,
      P85: standard.P85,
      P97: standard.P97,
    }));

    // Adicionar pontos do bebê
    heightRecords.forEach((record) => {
      const ageInMonths = calculateAgeInMonths(baby.birthDate, record.date);
      const roundedMonth = Math.round(ageInMonths);
      
      const existingPoint = data.find((d) => d.month === roundedMonth);
      if (existingPoint) {
        existingPoint.babyValue = record.height;
        existingPoint.babyLabel = `${record.height} cm`;
      } else if (roundedMonth >= 0 && roundedMonth <= 24) {
        const floorMonth = Math.floor(ageInMonths);
        const ceilMonth = Math.ceil(ageInMonths);
        const safeFloor = Math.min(Math.max(floorMonth, 0), heightStandards.length - 1);
        const safeCeil = Math.min(Math.max(ceilMonth, 0), heightStandards.length - 1);
        const ratio = ageInMonths - floorMonth;
        
        const interpolate = (key: keyof GrowthDataPoint) => {
          return (heightStandards[safeFloor][key] as number) * (1 - ratio) + 
                 (heightStandards[safeCeil][key] as number) * ratio;
        };

        data.push({
          month: roundedMonth,
          label: `${roundedMonth}m`,
          P3: interpolate('P3'),
          P15: interpolate('P15'),
          P50: interpolate('P50'),
          P85: interpolate('P85'),
          P97: interpolate('P97'),
          babyValue: record.height,
          babyLabel: `${record.height} cm`,
        });
      }
    });

    return data.sort((a, b) => a.month - b.month);
  }, [heightRecords, heightStandards, baby.birthDate]);

  // Calcular percentil atual
  const getLatestPercentile = (
    records: WeightRecord[] | HeightRecord[],
    standards: GrowthDataPoint[],
    isWeight: boolean
  ) => {
    if (records.length === 0) return null;
    
    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const latest = sortedRecords[0];
    const ageInMonths = calculateAgeInMonths(baby.birthDate, latest.date);
    const value = isWeight 
      ? (latest as WeightRecord).weight / 1000 
      : (latest as HeightRecord).height;
    
    return {
      value,
      ageInMonths,
      percentile: getPercentileRange(value, ageInMonths, standards),
    };
  };

  const latestWeightPercentile = getLatestPercentile(weightRecords, weightStandards, true);
  const latestHeightPercentile = getLatestPercentile(heightRecords, heightStandards, false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const babyData = payload.find((p: any) => p.dataKey === "babyValue");
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium mb-2">Idade: {label}</p>
          {babyData?.value && (
            <p className="text-primary font-semibold mb-2">
              {baby.name}: {babyData.value.toFixed(2)} {payload[0]?.unit || ""}
            </p>
          )}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>P97: {payload.find((p: any) => p.dataKey === "P97")?.value?.toFixed(1)}</p>
            <p>P85: {payload.find((p: any) => p.dataKey === "P85")?.value?.toFixed(1)}</p>
            <p className="font-medium text-foreground">P50 (mediana): {payload.find((p: any) => p.dataKey === "P50")?.value?.toFixed(1)}</p>
            <p>P15: {payload.find((p: any) => p.dataKey === "P15")?.value?.toFixed(1)}</p>
            <p>P3: {payload.find((p: any) => p.dataKey === "P3")?.value?.toFixed(1)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = (
    data: ChartDataPoint[],
    yAxisLabel: string,
    unit: string,
    domain: [number, number]
  ) => (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="colorP97" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.1} />
            <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorP85" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.15} />
            <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorP15" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.15} />
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorP3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        
        <XAxis 
          dataKey="label" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={domain}
          label={{ 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
          }}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        {/* Áreas dos percentis */}
        <Area
          type="monotone"
          dataKey="P97"
          stroke="hsl(var(--chart-5))"
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="url(#colorP97)"
          name="P97"
        />
        <Area
          type="monotone"
          dataKey="P85"
          stroke="hsl(var(--chart-4))"
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="url(#colorP85)"
          name="P85"
        />
        <Area
          type="monotone"
          dataKey="P50"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          fill="url(#colorP50)"
          name="P50 (Mediana)"
        />
        <Area
          type="monotone"
          dataKey="P15"
          stroke="hsl(var(--chart-2))"
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="url(#colorP15)"
          name="P15"
        />
        <Area
          type="monotone"
          dataKey="P3"
          stroke="hsl(var(--chart-1))"
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="url(#colorP3)"
          name="P3"
        />
        
        {/* Linha do bebê */}
        <Line
          type="monotone"
          dataKey="babyValue"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={{ 
            fill: "hsl(var(--primary))", 
            stroke: "hsl(var(--background))", 
            strokeWidth: 2,
            r: 6 
          }}
          activeDot={{ 
            r: 8, 
            fill: "hsl(var(--primary))",
            stroke: "hsl(var(--background))",
            strokeWidth: 2
          }}
          name={baby.name}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Curva de Crescimento
              </CardTitle>
              <CardDescription className="mt-1">
                Referência: OMS / Ministério da Saúde
              </CardDescription>
            </div>
            <Badge variant="outline" className={isBoy ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-pink-50 border-pink-200 text-pink-700"}>
              {isBoy ? "Padrão Masculino" : "Padrão Feminino"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Indicadores de percentil */}
          {(latestWeightPercentile || latestHeightPercentile) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {latestWeightPercentile && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Peso Atual</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {latestWeightPercentile.value.toFixed(2)} kg
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={getPercentileColor(latestWeightPercentile.percentile)}
                    >
                      {latestWeightPercentile.percentile}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    aos {latestWeightPercentile.ageInMonths.toFixed(1)} meses
                  </p>
                </div>
              )}
              
              {latestHeightPercentile && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Altura Atual</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {latestHeightPercentile.value} cm
                    </span>
                    <Badge 
                      variant="secondary"
                      className={getPercentileColor(latestHeightPercentile.percentile)}
                    >
                      {latestHeightPercentile.percentile}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    aos {latestHeightPercentile.ageInMonths.toFixed(1)} meses
                  </p>
                </div>
              )}
            </div>
          )}

          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="weight" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Peso x Idade
              </TabsTrigger>
              <TabsTrigger value="height" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Altura x Idade
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="mt-0">
              {weightRecords.length > 0 ? (
                renderChart(weightChartData, "Peso (kg)", "kg", [0, 16])
              ) : (
                <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                  <Scale className="h-12 w-12 mb-4 opacity-50" />
                  <p>Adicione registros de peso para ver a curva de crescimento</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="height" className="mt-0">
              {heightRecords.length > 0 ? (
                renderChart(heightChartData, "Altura (cm)", "cm", [40, 100])
              ) : (
                <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                  <Ruler className="h-12 w-12 mb-4 opacity-50" />
                  <p>Adicione registros de altura para ver a curva de crescimento</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Legenda explicativa */}
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-muted">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Sobre os percentis:</p>
                <p>
                  <strong>P50 (mediana)</strong>: Valor típico para a idade. 
                  <strong> P3-P97</strong>: Faixa considerada normal pelo Ministério da Saúde.
                </p>
                <p>
                  Valores fora dessa faixa merecem atenção e acompanhamento pediátrico.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GrowthChart;
