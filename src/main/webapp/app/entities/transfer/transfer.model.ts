import { IOperation } from 'app/entities/operation/operation.model';

export interface ITransfer {
  id?: number;
  cinDestinataireII?: string;
  nomPrenomDestinataireII?: string;
  telDestinataireII?: number | null;
  operation?: IOperation | null;
}

export class Transfer implements ITransfer {
  constructor(
    public id?: number,
    public cinDestinataireII?: string,
    public nomPrenomDestinataireII?: string,
    public telDestinataireII?: number | null,
    public operation?: IOperation | null
  ) {}
}

export function getTransferIdentifier(transfer: ITransfer): number | undefined {
  return transfer.id;
}
