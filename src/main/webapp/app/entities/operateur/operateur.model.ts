import { IRecharge } from 'app/entities/recharge/recharge.model';

export interface IOperateur {
  id?: number;
  nom?: string;
  recharges?: IRecharge[] | null;
}

export class Operateur implements IOperateur {
  constructor(public id?: number, public nom?: string, public recharges?: IRecharge[] | null) {}
}

export function getOperateurIdentifier(operateur: IOperateur): number | undefined {
  return operateur.id;
}
