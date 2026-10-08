export type Sursa = 'anaf' | 'onrc';

export interface RezultatCautare {
  sursa: Sursa;
  denumire: string;
  cui: string | null;
  codInmatriculare: string | null;
}
export interface CautareResponse { rezultate: RezultatCautare[] }

export type Platitor = Record<string, string> & {
  codFiscal: string; denumire: string; stare: string; tva: string; judet: string; localitate: string;
  strada: string; nr: string; codPostal: string; telefon: string; fax: string; dataInregistrare: string;
  dataStare: string; dataRadiere: string; tipUnitate: string; tipContrib: string; judetComert: string;
  nrComert: string; anComert: string; dataPrelucrare: string; actAutorizare: string;
};

export type FirmaOnrc = Record<string, string> & {
  denumire: string; cui: string; codInmatriculare: string; dataInmatriculare: string; euid: string;
  formaJuridica: string; adrTara: string; adrJudet: string; adrLocalitate: string; adrDenStrada: string;
  adrNrStrada: string; adrCodPostal: string; web: string; taraFirmaMama: string;
};

export interface BilantAn { an: number; formular: string }
export interface CuiResponse {
  cui: string;
  platitor: Platitor | null;
  inmatriculari: FirmaOnrc[];
  bilant: BilantAn[];
}

export interface Stare { cod: string; denumire: string | null }
export interface ReprezentantLegal {
  persoanaImputernicita: string; calitate: string; dataNastere: string; localitateNastere: string;
  judetNastere: string; taraNastere: string; localitate: string; judet: string; tara: string;
}
export interface ReprezentantIf {
  nume: string; dataNastere: string; localitateNastere: string; judetNastere: string;
  taraNastere: string; calitate: string;
}
export interface Sucursala {
  tipUnitate: string; denumireSucursala: string; euid: string; codFiscal: string; tara: string;
}
export interface InmatriculareResponse {
  codInmatriculare: string;
  firme: FirmaOnrc[];
  stari: Stare[];
  reprezentantiLegali: ReprezentantLegal[];
  reprezentantiIf: ReprezentantIf[];
  sucursale: Sucursala[];
  platitori: Platitor[];
}

export interface Indicator { cod: string; denumire: string; pozitie: number; valoare: number }
export interface FormularBilant {
  formular: string; caen: string | null; caenDenumire: string | null; caenVersiune: string;
  caeno: string | null; indicatori: Indicator[];
}
export interface BilantAnResponse { cui: string; an: number; formulare: FormularBilant[] }
export interface BilantToti { cui: string; ani: { an: number; formulare: FormularBilant[] }[] }

export interface DictIndicator { cod: string; denumire: string; pozitie: number; esteDimensiune: boolean }
export interface IndicatoriResponse { an: number; formular: string; indicatori: DictIndicator[] }

export interface VersiuneCaen { cod: string; descriere: string }
export interface ClasaCaen {
  sectiunea: string; subsectiunea: string; diviziunea: string; grupa: string; clasa: string;
  denumire: string; versiuneCaen: string;
}
export interface CaenResponse { versiune: string; clase: ClasaCaen[] }
export interface StareNomenclator { cod: string; denumire: string }
