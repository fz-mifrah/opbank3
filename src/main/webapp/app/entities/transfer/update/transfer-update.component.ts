import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITransfer, Transfer } from '../transfer.model';
import { TransferService } from '../service/transfer.service';

@Component({
  selector: 'jhi-transfer-update',
  templateUrl: './transfer-update.component.html',
})
export class TransferUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    cinDestinataireII: [null, [Validators.required]],
    nomPrenomDestinataireII: [null, [Validators.required]],
    telDestinataireII: [],
  });

  constructor(protected transferService: TransferService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transfer }) => {
      this.updateForm(transfer);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transfer = this.createFromForm();
    if (transfer.id !== undefined) {
      this.subscribeToSaveResponse(this.transferService.update(transfer));
    } else {
      this.subscribeToSaveResponse(this.transferService.create(transfer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransfer>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(transfer: ITransfer): void {
    this.editForm.patchValue({
      id: transfer.id,
      cinDestinataireII: transfer.cinDestinataireII,
      nomPrenomDestinataireII: transfer.nomPrenomDestinataireII,
      telDestinataireII: transfer.telDestinataireII,
    });
  }

  protected createFromForm(): ITransfer {
    return {
      ...new Transfer(),
      id: this.editForm.get(['id'])!.value,
      cinDestinataireII: this.editForm.get(['cinDestinataireII'])!.value,
      nomPrenomDestinataireII: this.editForm.get(['nomPrenomDestinataireII'])!.value,
      telDestinataireII: this.editForm.get(['telDestinataireII'])!.value,
    };
  }
}
