import { IVirement } from 'app/entities/virement/virement.model';

export interface IDestinataire {
  id?: number;
  nom?: string;
  prenom?: string;
  rib?: number;
  virements?: IVirement[] | null;
}

export class Destinataire implements IDestinataire {
  constructor(
    public id?: number,
    public nom?: string,
    public prenom?: string,
    public rib?: number,
    public virements?: IVirement[] | null
  ) {}
}

export function getDestinataireIdentifier(destinataire: IDestinataire): number | undefined {
  return destinataire.id;
}
