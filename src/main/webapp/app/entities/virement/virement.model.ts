import { IOperation } from 'app/entities/operation/operation.model';
import { IDestinataire } from 'app/entities/destinataire/destinataire.model';
import { IBeneficiaire } from 'app/entities/beneficiaire/beneficiaire.model';

export interface IVirement {
  id?: number;
  description?: string | null;
  operation?: IOperation | null;
  destinataire?: IDestinataire | null;
  beneficiaire?: IBeneficiaire | null;
}

export class Virement implements IVirement {
  constructor(
    public id?: number,
    public description?: string | null,
    public operation?: IOperation | null,
    public destinataire?: IDestinataire | null,
    public beneficiaire?: IBeneficiaire | null
  ) {}
}

export function getVirementIdentifier(virement: IVirement): number | undefined {
  return virement.id;
}
