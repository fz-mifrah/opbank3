import { IOperateur } from 'app/entities/operateur/operateur.model';
import { IOperation } from 'app/entities/operation/operation.model';

export interface IRecharge {
  id?: number;
  numTel?: number;
  operateurs?: IOperateur[] | null;
  operation?: IOperation | null;
}

export class Recharge implements IRecharge {
  constructor(public id?: number, public numTel?: number, public operateurs?: IOperateur[] | null, public operation?: IOperation | null) {}
}

export function getRechargeIdentifier(recharge: IRecharge): number | undefined {
  return recharge.id;
}
