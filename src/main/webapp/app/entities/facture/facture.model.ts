import { IPaimentFacture } from 'app/entities/paiment-facture/paiment-facture.model';

export interface IFacture {
  id?: number;
  nom?: string;
  paimentFactures?: IPaimentFacture[] | null;
}

export class Facture implements IFacture {
  constructor(public id?: number, public nom?: string, public paimentFactures?: IPaimentFacture[] | null) {}
}

export function getFactureIdentifier(facture: IFacture): number | undefined {
  return facture.id;
}
