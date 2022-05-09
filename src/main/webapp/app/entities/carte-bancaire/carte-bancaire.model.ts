import { ICompte } from 'app/entities/compte/compte.model';

export interface ICarteBancaire {
  id?: number;
  numCompte?: string;
  compte?: ICompte | null;
}

export class CarteBancaire implements ICarteBancaire {
  constructor(public id?: number, public numCompte?: string, public compte?: ICompte | null) {}
}

export function getCarteBancaireIdentifier(carteBancaire: ICarteBancaire): number | undefined {
  return carteBancaire.id;
}
