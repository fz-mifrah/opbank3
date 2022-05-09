import { IPaimentFacture } from 'app/entities/paiment-facture/paiment-facture.model';

export interface IService {
  id?: number;
  nomService?: string;
  paimentFactures?: IPaimentFacture[] | null;
}

export class Service implements IService {
  constructor(public id?: number, public nomService?: string, public paimentFactures?: IPaimentFacture[] | null) {}
}

export function getServiceIdentifier(service: IService): number | undefined {
  return service.id;
}
