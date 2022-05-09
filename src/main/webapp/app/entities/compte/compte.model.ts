import dayjs from 'dayjs/esm';
import { ICarteBancaire } from 'app/entities/carte-bancaire/carte-bancaire.model';
import { IOperation } from 'app/entities/operation/operation.model';
import { IClient } from 'app/entities/client/client.model';
import { IBanque } from 'app/entities/banque/banque.model';

export interface ICompte {
  id?: number;
  rib?: number;
  dateOuverture?: dayjs.Dayjs | null;
  code?: number;
  carteBancaire?: ICarteBancaire | null;
  operations?: IOperation[] | null;
  client?: IClient | null;
  banque?: IBanque | null;
}

export class Compte implements ICompte {
  constructor(
    public id?: number,
    public rib?: number,
    public dateOuverture?: dayjs.Dayjs | null,
    public code?: number,
    public carteBancaire?: ICarteBancaire | null,
    public operations?: IOperation[] | null,
    public client?: IClient | null,
    public banque?: IBanque | null
  ) {}
}

export function getCompteIdentifier(compte: ICompte): number | undefined {
  return compte.id;
}
