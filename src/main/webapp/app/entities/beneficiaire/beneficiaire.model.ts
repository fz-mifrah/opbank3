import { IVirement } from 'app/entities/virement/virement.model';

export interface IBeneficiaire {
  id?: number;
  nomPrenom?: string;
  numCompte?: number;
  virements?: IVirement[] | null;
}

export class Beneficiaire implements IBeneficiaire {
  constructor(public id?: number, public nomPrenom?: string, public numCompte?: number, public virements?: IVirement[] | null) {}
}

export function getBeneficiaireIdentifier(beneficiaire: IBeneficiaire): number | undefined {
  return beneficiaire.id;
}
