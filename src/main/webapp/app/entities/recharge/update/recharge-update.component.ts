import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRecharge, Recharge } from '../recharge.model';
import { RechargeService } from '../service/recharge.service';
import { IOperateur } from 'app/entities/operateur/operateur.model';
import { OperateurService } from 'app/entities/operateur/service/operateur.service';

@Component({
  selector: 'jhi-recharge-update',
  templateUrl: './recharge-update.component.html',
})
export class RechargeUpdateComponent implements OnInit {
  isSaving = false;

  operateursSharedCollection: IOperateur[] = [];

  editForm = this.fb.group({
    id: [],
    numTel: [null, [Validators.required]],
    operateurs: [],
  });

  constructor(
    protected rechargeService: RechargeService,
    protected operateurService: OperateurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recharge }) => {
      this.updateForm(recharge);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recharge = this.createFromForm();
    if (recharge.id !== undefined) {
      this.subscribeToSaveResponse(this.rechargeService.update(recharge));
    } else {
      this.subscribeToSaveResponse(this.rechargeService.create(recharge));
    }
  }

  trackOperateurById(_index: number, item: IOperateur): number {
    return item.id!;
  }

  getSelectedOperateur(option: IOperateur, selectedVals?: IOperateur[]): IOperateur {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecharge>>): void {
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

  protected updateForm(recharge: IRecharge): void {
    this.editForm.patchValue({
      id: recharge.id,
      numTel: recharge.numTel,
      operateurs: recharge.operateurs,
    });

    this.operateursSharedCollection = this.operateurService.addOperateurToCollectionIfMissing(
      this.operateursSharedCollection,
      ...(recharge.operateurs ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.operateurService
      .query()
      .pipe(map((res: HttpResponse<IOperateur[]>) => res.body ?? []))
      .pipe(
        map((operateurs: IOperateur[]) =>
          this.operateurService.addOperateurToCollectionIfMissing(operateurs, ...(this.editForm.get('operateurs')!.value ?? []))
        )
      )
      .subscribe((operateurs: IOperateur[]) => (this.operateursSharedCollection = operateurs));
  }

  protected createFromForm(): IRecharge {
    return {
      ...new Recharge(),
      id: this.editForm.get(['id'])!.value,
      numTel: this.editForm.get(['numTel'])!.value,
      operateurs: this.editForm.get(['operateurs'])!.value,
    };
  }
}
