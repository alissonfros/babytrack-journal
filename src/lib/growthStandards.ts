/**
 * Dados de referência das Curvas de Crescimento OMS/Ministério da Saúde
 * Fonte: WHO Child Growth Standards
 * 
 * Os dados representam os percentis P3, P15, P50, P85 e P97
 * para peso (kg) e altura/comprimento (cm) por idade em meses
 */

export interface GrowthDataPoint {
  month: number;
  P3: number;
  P15: number;
  P50: number;
  P85: number;
  P97: number;
}

// Peso para idade - Meninos (0-24 meses) em kg
export const weightForAgeBoys: GrowthDataPoint[] = [
  { month: 0, P3: 2.5, P15: 2.9, P50: 3.3, P85: 3.9, P97: 4.4 },
  { month: 1, P3: 3.4, P15: 3.9, P50: 4.5, P85: 5.1, P97: 5.8 },
  { month: 2, P3: 4.3, P15: 4.9, P50: 5.6, P85: 6.3, P97: 7.1 },
  { month: 3, P3: 5.0, P15: 5.7, P50: 6.4, P85: 7.2, P97: 8.0 },
  { month: 4, P3: 5.6, P15: 6.2, P50: 7.0, P85: 7.8, P97: 8.7 },
  { month: 5, P3: 6.0, P15: 6.7, P50: 7.5, P85: 8.4, P97: 9.3 },
  { month: 6, P3: 6.4, P15: 7.1, P50: 7.9, P85: 8.8, P97: 9.8 },
  { month: 7, P3: 6.7, P15: 7.4, P50: 8.3, P85: 9.2, P97: 10.3 },
  { month: 8, P3: 6.9, P15: 7.7, P50: 8.6, P85: 9.6, P97: 10.7 },
  { month: 9, P3: 7.1, P15: 8.0, P50: 8.9, P85: 9.9, P97: 11.0 },
  { month: 10, P3: 7.4, P15: 8.2, P50: 9.2, P85: 10.2, P97: 11.4 },
  { month: 11, P3: 7.6, P15: 8.4, P50: 9.4, P85: 10.5, P97: 11.7 },
  { month: 12, P3: 7.7, P15: 8.6, P50: 9.6, P85: 10.8, P97: 12.0 },
  { month: 13, P3: 7.9, P15: 8.8, P50: 9.9, P85: 11.0, P97: 12.3 },
  { month: 14, P3: 8.1, P15: 9.0, P50: 10.1, P85: 11.3, P97: 12.6 },
  { month: 15, P3: 8.3, P15: 9.2, P50: 10.3, P85: 11.5, P97: 12.8 },
  { month: 16, P3: 8.4, P15: 9.4, P50: 10.5, P85: 11.7, P97: 13.1 },
  { month: 17, P3: 8.6, P15: 9.6, P50: 10.7, P85: 12.0, P97: 13.4 },
  { month: 18, P3: 8.8, P15: 9.8, P50: 10.9, P85: 12.2, P97: 13.7 },
  { month: 19, P3: 8.9, P15: 10.0, P50: 11.1, P85: 12.5, P97: 13.9 },
  { month: 20, P3: 9.1, P15: 10.1, P50: 11.3, P85: 12.7, P97: 14.2 },
  { month: 21, P3: 9.2, P15: 10.3, P50: 11.5, P85: 12.9, P97: 14.5 },
  { month: 22, P3: 9.4, P15: 10.5, P50: 11.8, P85: 13.2, P97: 14.7 },
  { month: 23, P3: 9.5, P15: 10.7, P50: 12.0, P85: 13.4, P97: 15.0 },
  { month: 24, P3: 9.7, P15: 10.8, P50: 12.2, P85: 13.6, P97: 15.3 },
];

// Peso para idade - Meninas (0-24 meses) em kg
export const weightForAgeGirls: GrowthDataPoint[] = [
  { month: 0, P3: 2.4, P15: 2.8, P50: 3.2, P85: 3.7, P97: 4.2 },
  { month: 1, P3: 3.2, P15: 3.6, P50: 4.2, P85: 4.8, P97: 5.5 },
  { month: 2, P3: 3.9, P15: 4.5, P50: 5.1, P85: 5.8, P97: 6.6 },
  { month: 3, P3: 4.5, P15: 5.2, P50: 5.8, P85: 6.6, P97: 7.5 },
  { month: 4, P3: 5.0, P15: 5.7, P50: 6.4, P85: 7.3, P97: 8.2 },
  { month: 5, P3: 5.4, P15: 6.1, P50: 6.9, P85: 7.8, P97: 8.8 },
  { month: 6, P3: 5.7, P15: 6.5, P50: 7.3, P85: 8.2, P97: 9.3 },
  { month: 7, P3: 6.0, P15: 6.8, P50: 7.6, P85: 8.6, P97: 9.8 },
  { month: 8, P3: 6.3, P15: 7.0, P50: 7.9, P85: 9.0, P97: 10.2 },
  { month: 9, P3: 6.5, P15: 7.3, P50: 8.2, P85: 9.3, P97: 10.5 },
  { month: 10, P3: 6.7, P15: 7.5, P50: 8.5, P85: 9.6, P97: 10.9 },
  { month: 11, P3: 6.9, P15: 7.7, P50: 8.7, P85: 9.9, P97: 11.2 },
  { month: 12, P3: 7.0, P15: 7.9, P50: 8.9, P85: 10.1, P97: 11.5 },
  { month: 13, P3: 7.2, P15: 8.1, P50: 9.2, P85: 10.4, P97: 11.8 },
  { month: 14, P3: 7.4, P15: 8.3, P50: 9.4, P85: 10.6, P97: 12.1 },
  { month: 15, P3: 7.6, P15: 8.5, P50: 9.6, P85: 10.9, P97: 12.4 },
  { month: 16, P3: 7.7, P15: 8.7, P50: 9.8, P85: 11.1, P97: 12.6 },
  { month: 17, P3: 7.9, P15: 8.9, P50: 10.0, P85: 11.4, P97: 12.9 },
  { month: 18, P3: 8.1, P15: 9.1, P50: 10.2, P85: 11.6, P97: 13.2 },
  { month: 19, P3: 8.2, P15: 9.2, P50: 10.4, P85: 11.8, P97: 13.5 },
  { month: 20, P3: 8.4, P15: 9.4, P50: 10.6, P85: 12.1, P97: 13.7 },
  { month: 21, P3: 8.6, P15: 9.6, P50: 10.9, P85: 12.3, P97: 14.0 },
  { month: 22, P3: 8.7, P15: 9.8, P50: 11.1, P85: 12.5, P97: 14.3 },
  { month: 23, P3: 8.9, P15: 10.0, P50: 11.3, P85: 12.8, P97: 14.6 },
  { month: 24, P3: 9.0, P15: 10.2, P50: 11.5, P85: 13.0, P97: 14.8 },
];

// Comprimento/Altura para idade - Meninos (0-24 meses) em cm
export const heightForAgeBoys: GrowthDataPoint[] = [
  { month: 0, P3: 46.1, P15: 47.9, P50: 49.9, P85: 51.8, P97: 53.7 },
  { month: 1, P3: 50.8, P15: 52.8, P50: 54.7, P85: 56.7, P97: 58.6 },
  { month: 2, P3: 54.4, P15: 56.4, P50: 58.4, P85: 60.4, P97: 62.4 },
  { month: 3, P3: 57.3, P15: 59.4, P50: 61.4, P85: 63.5, P97: 65.5 },
  { month: 4, P3: 59.7, P15: 61.8, P50: 63.9, P85: 66.0, P97: 68.0 },
  { month: 5, P3: 61.7, P15: 63.8, P50: 65.9, P85: 68.0, P97: 70.1 },
  { month: 6, P3: 63.3, P15: 65.5, P50: 67.6, P85: 69.8, P97: 71.9 },
  { month: 7, P3: 64.8, P15: 67.0, P50: 69.2, P85: 71.3, P97: 73.5 },
  { month: 8, P3: 66.2, P15: 68.4, P50: 70.6, P85: 72.8, P97: 75.0 },
  { month: 9, P3: 67.5, P15: 69.7, P50: 72.0, P85: 74.2, P97: 76.5 },
  { month: 10, P3: 68.7, P15: 71.0, P50: 73.3, P85: 75.6, P97: 77.9 },
  { month: 11, P3: 69.9, P15: 72.2, P50: 74.5, P85: 76.9, P97: 79.2 },
  { month: 12, P3: 71.0, P15: 73.4, P50: 75.7, P85: 78.1, P97: 80.5 },
  { month: 13, P3: 72.1, P15: 74.5, P50: 76.9, P85: 79.3, P97: 81.8 },
  { month: 14, P3: 73.1, P15: 75.6, P50: 78.0, P85: 80.5, P97: 83.0 },
  { month: 15, P3: 74.1, P15: 76.6, P50: 79.1, P85: 81.7, P97: 84.2 },
  { month: 16, P3: 75.0, P15: 77.6, P50: 80.2, P85: 82.8, P97: 85.4 },
  { month: 17, P3: 76.0, P15: 78.6, P50: 81.2, P85: 83.9, P97: 86.5 },
  { month: 18, P3: 76.9, P15: 79.6, P50: 82.3, P85: 85.0, P97: 87.7 },
  { month: 19, P3: 77.7, P15: 80.5, P50: 83.2, P85: 86.0, P97: 88.8 },
  { month: 20, P3: 78.6, P15: 81.4, P50: 84.2, P85: 87.0, P97: 89.8 },
  { month: 21, P3: 79.4, P15: 82.3, P50: 85.1, P85: 88.0, P97: 90.9 },
  { month: 22, P3: 80.2, P15: 83.1, P50: 86.0, P85: 89.0, P97: 91.9 },
  { month: 23, P3: 81.0, P15: 83.9, P50: 86.9, P85: 89.9, P97: 92.9 },
  { month: 24, P3: 81.7, P15: 84.8, P50: 87.8, P85: 90.9, P97: 93.9 },
];

// Comprimento/Altura para idade - Meninas (0-24 meses) em cm
export const heightForAgeGirls: GrowthDataPoint[] = [
  { month: 0, P3: 45.4, P15: 47.3, P50: 49.1, P85: 51.0, P97: 52.9 },
  { month: 1, P3: 49.8, P15: 51.7, P50: 53.7, P85: 55.6, P97: 57.6 },
  { month: 2, P3: 53.0, P15: 55.0, P50: 57.1, P85: 59.1, P97: 61.1 },
  { month: 3, P3: 55.6, P15: 57.7, P50: 59.8, P85: 61.9, P97: 64.0 },
  { month: 4, P3: 57.8, P15: 59.9, P50: 62.1, P85: 64.3, P97: 66.4 },
  { month: 5, P3: 59.6, P15: 61.8, P50: 64.0, P85: 66.2, P97: 68.5 },
  { month: 6, P3: 61.2, P15: 63.5, P50: 65.7, P85: 68.0, P97: 70.3 },
  { month: 7, P3: 62.7, P15: 65.0, P50: 67.3, P85: 69.6, P97: 71.9 },
  { month: 8, P3: 64.0, P15: 66.4, P50: 68.7, P85: 71.1, P97: 73.5 },
  { month: 9, P3: 65.3, P15: 67.7, P50: 70.1, P85: 72.6, P97: 75.0 },
  { month: 10, P3: 66.5, P15: 69.0, P50: 71.5, P85: 74.0, P97: 76.4 },
  { month: 11, P3: 67.7, P15: 70.3, P50: 72.8, P85: 75.3, P97: 77.8 },
  { month: 12, P3: 68.9, P15: 71.4, P50: 74.0, P85: 76.6, P97: 79.2 },
  { month: 13, P3: 70.0, P15: 72.6, P50: 75.2, P85: 77.8, P97: 80.5 },
  { month: 14, P3: 71.0, P15: 73.7, P50: 76.4, P85: 79.1, P97: 81.7 },
  { month: 15, P3: 72.0, P15: 74.8, P50: 77.5, P85: 80.2, P97: 83.0 },
  { month: 16, P3: 73.0, P15: 75.8, P50: 78.6, P85: 81.4, P97: 84.2 },
  { month: 17, P3: 74.0, P15: 76.8, P50: 79.7, P85: 82.5, P97: 85.4 },
  { month: 18, P3: 74.9, P15: 77.8, P50: 80.7, P85: 83.6, P97: 86.5 },
  { month: 19, P3: 75.8, P15: 78.8, P50: 81.7, P85: 84.7, P97: 87.6 },
  { month: 20, P3: 76.7, P15: 79.7, P50: 82.7, P85: 85.7, P97: 88.7 },
  { month: 21, P3: 77.5, P15: 80.6, P50: 83.7, P85: 86.7, P97: 89.8 },
  { month: 22, P3: 78.4, P15: 81.5, P50: 84.6, P85: 87.7, P97: 90.8 },
  { month: 23, P3: 79.2, P15: 82.3, P50: 85.5, P85: 88.7, P97: 91.9 },
  { month: 24, P3: 80.0, P15: 83.2, P50: 86.4, P85: 89.6, P97: 92.9 },
];

/**
 * Calcula a idade em meses a partir da data de nascimento e data da medição
 */
export const calculateAgeInMonths = (birthDate: string, measurementDate: string): number => {
  const birth = new Date(birthDate);
  const measurement = new Date(measurementDate);
  
  const months = (measurement.getFullYear() - birth.getFullYear()) * 12 + 
                 (measurement.getMonth() - birth.getMonth()) +
                 (measurement.getDate() - birth.getDate()) / 30;
  
  return Math.max(0, parseFloat(months.toFixed(1)));
};

/**
 * Determina em qual percentil o bebê se encontra
 */
export const getPercentileRange = (
  value: number, 
  ageInMonths: number, 
  data: GrowthDataPoint[]
): string => {
  const floorMonth = Math.floor(ageInMonths);
  const ceilMonth = Math.ceil(ageInMonths);
  
  // Limitar ao range disponível
  const safeFloor = Math.min(Math.max(floorMonth, 0), data.length - 1);
  const safeCeil = Math.min(Math.max(ceilMonth, 0), data.length - 1);
  
  // Interpolação linear se necessário
  const ratio = ageInMonths - floorMonth;
  const interpolate = (key: keyof GrowthDataPoint) => {
    if (typeof data[safeFloor][key] === 'number' && typeof data[safeCeil][key] === 'number') {
      return (data[safeFloor][key] as number) * (1 - ratio) + (data[safeCeil][key] as number) * ratio;
    }
    return data[safeFloor][key] as number;
  };
  
  const P3 = interpolate('P3');
  const P15 = interpolate('P15');
  const P50 = interpolate('P50');
  const P85 = interpolate('P85');
  const P97 = interpolate('P97');
  
  if (value < P3) return 'Abaixo do P3';
  if (value < P15) return 'Entre P3 e P15';
  if (value < P50) return 'Entre P15 e P50';
  if (value < P85) return 'Entre P50 e P85';
  if (value < P97) return 'Entre P85 e P97';
  return 'Acima do P97';
};

/**
 * Retorna a cor para o indicador de percentil
 */
export const getPercentileColor = (percentileRange: string): string => {
  switch (percentileRange) {
    case 'Abaixo do P3':
      return 'text-red-600';
    case 'Entre P3 e P15':
      return 'text-orange-500';
    case 'Entre P15 e P50':
      return 'text-yellow-600';
    case 'Entre P50 e P85':
      return 'text-green-600';
    case 'Entre P85 e P97':
      return 'text-blue-500';
    case 'Acima do P97':
      return 'text-purple-600';
    default:
      return 'text-muted-foreground';
  }
};
