import { IDestinataire } from 'app/entities/destinataire/destinataire.model';
import { IBeneficiaire } from 'app/entities/beneficiaire/beneficiaire.model';
import { IOperation } from 'app/entities/operation/operation.model';

export interface IVirement {
  id?: number;
  description?: string | null;
  destinataires?: IDestinataire[] | null;
  beneficiaires?: IBeneficiaire[] | null;
  operation?: IOperation | null;
}

export class Virement implements IVirement {
  constructor(
    public id?: number,
    public description?: string | null,
    public destinataires?: IDestinataire[] | null,
    public beneficiaires?: IBeneficiaire[] | null,
    public operation?: IOperation | null
  ) {}
}

export function getVirementIdentifier(virement: IVirement): number | undefined {
  return virement.id;
}
