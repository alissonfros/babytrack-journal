
import { Baby, WeightRecord, HeightRecord, Vaccine, VaccineRecord, Medication } from './types';
import { v4 as uuid } from 'uuid';

// Local Storage Keys
const BABIES_STORAGE_KEY = 'babytrack_babies';
const WEIGHT_STORAGE_KEY = 'babytrack_weight_records';
const HEIGHT_STORAGE_KEY = 'babytrack_height_records';
const VACCINE_STORAGE_KEY = 'babytrack_vaccines';
const VACCINE_RECORD_STORAGE_KEY = 'babytrack_vaccine_records';
const MEDICATION_STORAGE_KEY = 'babytrack_medications';

// Helper Function to Save and Get Data
const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// Babies Functions
export const getBabies = (): Baby[] => {
  return getData<Baby[]>(BABIES_STORAGE_KEY, []);
};

export const getBaby = (id: string): Baby | undefined => {
  const babies = getBabies();
  return babies.find(baby => baby.id === id);
};

export const saveBaby = (baby: Omit<Baby, 'id'>): Baby => {
  const newBaby = { ...baby, id: uuid() };
  const babies = getBabies();
  babies.push(newBaby);
  saveData(BABIES_STORAGE_KEY, babies);
  return newBaby;
};

export const updateBaby = (baby: Baby): void => {
  const babies = getBabies();
  const index = babies.findIndex(b => b.id === baby.id);
  if (index !== -1) {
    babies[index] = baby;
    saveData(BABIES_STORAGE_KEY, babies);
  }
};

export const deleteBaby = (id: string): void => {
  const babies = getBabies();
  const updatedBabies = babies.filter(baby => baby.id !== id);
  saveData(BABIES_STORAGE_KEY, updatedBabies);
  
  // Also delete related records
  const weightRecords = getWeightRecords().filter(record => record.babyId !== id);
  saveData(WEIGHT_STORAGE_KEY, weightRecords);
  
  const heightRecords = getHeightRecords().filter(record => record.babyId !== id);
  saveData(HEIGHT_STORAGE_KEY, heightRecords);
  
  const vaccineRecords = getVaccineRecords().filter(record => record.babyId !== id);
  saveData(VACCINE_RECORD_STORAGE_KEY, vaccineRecords);
  
  const medications = getMedications().filter(med => med.babyId !== id);
  saveData(MEDICATION_STORAGE_KEY, medications);
};

// Weight Records Functions
export const getWeightRecords = (babyId?: string): WeightRecord[] => {
  const records = getData<WeightRecord[]>(WEIGHT_STORAGE_KEY, []);
  return babyId ? records.filter(record => record.babyId === babyId) : records;
};

export const saveWeightRecord = (record: Omit<WeightRecord, 'id'>): WeightRecord => {
  const newRecord = { ...record, id: uuid() };
  const records = getWeightRecords();
  records.push(newRecord);
  saveData(WEIGHT_STORAGE_KEY, records);
  return newRecord;
};

export const updateWeightRecord = (record: WeightRecord): void => {
  const records = getWeightRecords();
  const index = records.findIndex(r => r.id === record.id);
  if (index !== -1) {
    records[index] = record;
    saveData(WEIGHT_STORAGE_KEY, records);
  }
};

export const deleteWeightRecord = (id: string): void => {
  const records = getWeightRecords();
  const updatedRecords = records.filter(record => record.id !== id);
  saveData(WEIGHT_STORAGE_KEY, updatedRecords);
};

// Height Records Functions
export const getHeightRecords = (babyId?: string): HeightRecord[] => {
  const records = getData<HeightRecord[]>(HEIGHT_STORAGE_KEY, []);
  return babyId ? records.filter(record => record.babyId === babyId) : records;
};

export const saveHeightRecord = (record: Omit<HeightRecord, 'id'>): HeightRecord => {
  const newRecord = { ...record, id: uuid() };
  const records = getHeightRecords();
  records.push(newRecord);
  saveData(HEIGHT_STORAGE_KEY, records);
  return newRecord;
};

export const updateHeightRecord = (record: HeightRecord): void => {
  const records = getHeightRecords();
  const index = records.findIndex(r => r.id === record.id);
  if (index !== -1) {
    records[index] = record;
    saveData(HEIGHT_STORAGE_KEY, records);
  }
};

export const deleteHeightRecord = (id: string): void => {
  const records = getHeightRecords();
  const updatedRecords = records.filter(record => record.id !== id);
  saveData(HEIGHT_STORAGE_KEY, updatedRecords);
};

// Vaccines Functions
export const getVaccines = (): Vaccine[] => {
  const defaultVaccines: Vaccine[] = [
    { id: '1', name: 'BCG', recommendedAge: 'Ao nascer', description: 'Previne formas graves de tuberculose' },
    { id: '2', name: 'Hepatite B', recommendedAge: 'Ao nascer', description: 'Previne a hepatite B' },
    { id: '3', name: 'Pentavalente', recommendedAge: '2 meses', description: 'Previne difteria, tétano, coqueluche, hepatite B e infecções por Haemophilus influenzae tipo b' },
    { id: '4', name: 'VIP/VOP', recommendedAge: '2 meses', description: 'Previne a poliomielite' },
    { id: '5', name: 'Pneumocócica 10V', recommendedAge: '2 meses', description: 'Previne a pneumonia, meningite e otite causadas por pneumococo' },
    { id: '6', name: 'Rotavírus', recommendedAge: '2 meses', description: 'Previne diarreia por rotavírus' },
    { id: '7', name: 'Meningocócica C', recommendedAge: '3 meses', description: 'Previne a doença meningocócica C' },
    { id: '8', name: 'Pentavalente', recommendedAge: '4 meses', description: 'Segunda dose' },
    { id: '9', name: 'VIP/VOP', recommendedAge: '4 meses', description: 'Segunda dose' },
    { id: '10', name: 'Pneumocócica 10V', recommendedAge: '4 meses', description: 'Segunda dose' },
    { id: '11', name: 'Rotavírus', recommendedAge: '4 meses', description: 'Segunda dose' },
    { id: '12', name: 'Meningocócica C', recommendedAge: '5 meses', description: 'Segunda dose' }
  ];
  
  return getData<Vaccine[]>(VACCINE_STORAGE_KEY, defaultVaccines);
};

export const saveVaccine = (vaccine: Omit<Vaccine, 'id'>): Vaccine => {
  const newVaccine = { ...vaccine, id: uuid() };
  const vaccines = getVaccines();
  vaccines.push(newVaccine);
  saveData(VACCINE_STORAGE_KEY, vaccines);
  return newVaccine;
};

// Vaccine Records Functions
export const getVaccineRecords = (babyId?: string): VaccineRecord[] => {
  const records = getData<VaccineRecord[]>(VACCINE_RECORD_STORAGE_KEY, []);
  return babyId ? records.filter(record => record.babyId === babyId) : records;
};

export const saveVaccineRecord = (record: Omit<VaccineRecord, 'id'>): VaccineRecord => {
  const newRecord = { ...record, id: uuid() };
  const records = getVaccineRecords();
  records.push(newRecord);
  saveData(VACCINE_RECORD_STORAGE_KEY, records);
  return newRecord;
};

export const updateVaccineRecord = (record: VaccineRecord): void => {
  const records = getVaccineRecords();
  const index = records.findIndex(r => r.id === record.id);
  if (index !== -1) {
    records[index] = record;
    saveData(VACCINE_RECORD_STORAGE_KEY, records);
  }
};

// Medications Functions
export const getMedications = (babyId?: string): Medication[] => {
  const medications = getData<Medication[]>(MEDICATION_STORAGE_KEY, []);
  return babyId ? medications.filter(med => med.babyId === babyId) : medications;
};

export const saveMedication = (medication: Omit<Medication, 'id'>): Medication => {
  const newMedication = { ...medication, id: uuid() };
  const medications = getMedications();
  medications.push(newMedication);
  saveData(MEDICATION_STORAGE_KEY, medications);
  return newMedication;
};

export const updateMedication = (medication: Medication): void => {
  const medications = getMedications();
  const index = medications.findIndex(med => med.id === medication.id);
  if (index !== -1) {
    medications[index] = medication;
    saveData(MEDICATION_STORAGE_KEY, medications);
  }
};

export const deleteMedication = (id: string): void => {
  const medications = getMedications();
  const updatedMedications = medications.filter(med => med.id !== id);
  saveData(MEDICATION_STORAGE_KEY, updatedMedications);
};
