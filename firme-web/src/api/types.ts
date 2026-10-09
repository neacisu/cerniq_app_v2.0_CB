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

/* ───────── Graful administratorilor (GET /grup/*) ───────── */
export type StratGrup = 'administrator' | 'profesional';
export interface NodFirmaGrup { id: string; tip: 'firma'; cod: string; cui: string | null; denumire: string; nivel: number; radacina: boolean }
export interface NodPersoanaGrup { id: string; tip: 'persoana'; nume: string; data: string; slaba: boolean; nivel: number; nrFirme: number; calitati: string[] }
export interface MuchieGrup { persoana: string; firma: string; calitate: string; strat: StratGrup; slaba: boolean }
export interface NeconfirmatGrup { nume: string; data: string | null; calitate: string; strat: StratGrup; motiv: 'fara-data' | 'data-slaba' }
export interface GrafGrup {
  radacina: { cod: string; cui: string | null; denumire: string };
  noduri: (NodFirmaGrup | NodPersoanaGrup)[];
  muchii: MuchieGrup[];
  neconfirmate: NeconfirmatGrup[];
  roluri: { calitate: string; nr: number; activ: boolean }[];
  trunchiat: boolean;
  omise: { firme: number; persoane: number };
  parametri: { adancime: 1 | 2; plafon: number; profesionisti: boolean; dateSlabe: boolean; fara: string[]; faraRoluri: string[] };
}
export interface ParamGrup { adancime: 1 | 2; plafon: number; profesionisti: boolean; slabe: boolean; fara: string[]; faraRoluri: string[] }

/* ───────── ANAF v9 (GET /anaf/:cui, /anaf?cui=…) ───────── */
export type StareInterogare = 'gasit' | 'negasit' | 'asteptare' | 'exclus' | 'absent';
export type StareFiscala = 'activ' | 'inactiv' | 'suspendat' | 'dizolvat' | 'radiat' | 'necunoscut';
export type StareTva = 'platitor' | 'anulat' | 'neplatitor' | 'necunoscut';
export interface AnafRezumat {
  cui: string; stare: StareInterogare; motiv?: string | null; denumire?: string | null; stareFiscala?: StareFiscala; tva?: StareTva;
  eFactura?: boolean | null; dataInactivare?: string | null; dataInterogare?: string | null; descoperitDeScanare?: boolean;
}
export interface AdresaAnaf { strada: string | null; numar: string | null; localitate: string | null; judet: string | null; codPostal: string | null; detalii: string | null; tara: string | null }
export interface PerioadaTva { ordine: number; inceput: string | null; sfarsit: string | null; dataAnulare: string | null; mesaj: string | null }
export interface Discrepanta { camp: 'stare' | 'tva' | 'denumire' | 'adresa'; v9: string; snapshot: string }
export interface AnafFirma {
  cui: string; stare: StareInterogare; motiv?: string | null; descoperitDeScanare?: boolean; dataInterogare?: string;
  stareFiscala?: StareFiscala; tva?: StareTva;
  generale?: { denumire: string | null; adresa: string | null; nrRegCom: string | null; telefon: string | null; fax: string | null; codPostal: string | null; act: string | null; stareInregistrare: string | null; dataInregistrare: string | null; codCaen: string | null; iban: string | null; organFiscal: string | null; formaProprietate: string | null; formaOrganizare: string | null; formaJuridica: string | null };
  inactiv?: { activ: boolean; dataInactivare: string | null; dataReactivare: string | null; dataPublicare: string | null; dataRadiere: string | null };
  tvaDetaliu?: { inScopTva: boolean | null; perioade: PerioadaTva[] };
  tvaIncasare?: { activ: boolean; inceput: string | null; sfarsit: string | null; actualizare: string | null; publicare: string | null; tipAct: string | null };
  split?: { activ: boolean; inceput: string | null; anulare: string | null };
  eFactura?: { inregistrat: boolean; data: string | null };
  sediu?: AdresaAnaf; domiciliu?: AdresaAnaf;
  surse?: { sursa: string; codInmatriculare: string | null; nrRanduri: number; adreseDiferite: boolean | null; denumiriDiferite: boolean | null }[];
  snapshot?: { stare: string | null; tva: string | null; denumire: string | null; dataStare: string | null; telefon: string | null; fax: string | null } | null;
  discrepante?: Discrepanta[];
}

/* ───────── Dosare (GET /dosare, /dosare/:id) ───────── */
export type GradPotrivire = 'exacta' | 'reprezentant' | 'partiala' | 'nume';
export interface LegaturaDosar { parte: string; calitate: string; motiv: string; interogat: string; grad: GradPotrivire }
export interface DosarLista {
  id: number; numar: string; instanta: string; departament: string; categorie: string; stadiu: string; obiect: string;
  dataDosar: string | null; dataModificare: string | null; anDosar: number | null; rol: string[]; potrivire: GradPotrivire; legaturi: LegaturaDosar[];
  nrParti: number; nrSedinte: number; ultimaSedinta: string | null; nrCaiAtac: number; dataInViitor: boolean;
}
export interface Faceta { valoare: string; nr: number }
export interface SumarDosare { total: number; categorii: Faceta[]; stadii: Faceta[]; roluri: Faceta[]; ani: Faceta[]; instante: Faceta[]; potriviri: Faceta[]; primul: string | null; ultimul: string | null }
export interface AcoperireDosare { stare: 'complet' | 'partial' | 'in-asteptare' | 'necautat' | 'necunoscut'; cautari: { sursa: string; tip: string; nume: string; stare: string; dosareGasite: number; plafonAtins: boolean; actualizat: string | null }[] }
export interface DosareResponse {
  cui: string | null; cod: string | null; denumireFirma: string; acoperire: AcoperireDosare; trunchiat: boolean; plafonIncarcare: number;
  total: number; totalFirma: number; sumarFirma: SumarDosare; sumarFiltrat: SumarDosare; pagina: { limit: number; offset: number }; dosare: DosarLista[];
}
export interface DosarDetaliu extends DosarLista {
  numarVechi: string | null; obiecteSecundare: string | null; dataInitiala: string | null;
  parti: { ord: number; nume: string; calitate: string; calitateAnterioara: string | null; dataCalitate: string | null }[];
  sedinte: { data: string | null; ora: string | null; complet: string | null; solutie: string | null; solutieSumar: string | null; dataPronuntare: string | null; document: string | null; numarDocument: string | null; dataDocument: string | null }[];
  caiAtac: { data: string | null; parte: string | null; tip: string | null }[];
}
export interface FiltreDosare { categorie?: string; stadiu?: string; rol?: string; an?: number; potrivire?: GradPotrivire; q?: string; doarExacte?: boolean; limit: number; offset: number }
