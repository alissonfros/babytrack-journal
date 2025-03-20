
export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  photo?: string;
  notes?: string;
}

export interface WeightRecord {
  id: string;
  babyId: string;
  date: string;
  weight: number; // em gramas
  notes?: string;
}

export interface HeightRecord {
  id: string;
  babyId: string;
  date: string;
  height: number; // em centímetros
  notes?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  recommendedAge: string; // ex: "2 meses"
  description?: string;
}

export interface VaccineRecord {
  id: string;
  babyId: string;
  vaccineId: string;
  date: string;
  applied: boolean;
  location?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  babyId: string;
  name: string;
  reason: string;
  dateStarted: string;
  dateEnded?: string;
  dosage?: string;
  frequency?: string;
  notes?: string;
}
