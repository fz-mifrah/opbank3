import { IVirement } from 'app/entities/virement/virement.model';

export interface IBeneficiaire {
  id?: number;
  nomPrenom?: string;
  numCompte?: number;
  virement?: IVirement | null;
}

export class Beneficiaire implements IBeneficiaire {
  constructor(public id?: number, public nomPrenom?: string, public numCompte?: number, public virement?: IVirement | null) {}
}

export function getBeneficiaireIdentifier(beneficiaire: IBeneficiaire): number | undefined {
  return beneficiaire.id;
}
