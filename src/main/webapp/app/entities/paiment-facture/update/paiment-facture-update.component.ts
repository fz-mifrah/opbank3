import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaimentFacture, PaimentFacture } from '../paiment-facture.model';
import { PaimentFactureService } from '../service/paiment-facture.service';
import { IFacture } from 'app/entities/facture/facture.model';
import { FactureService } from 'app/entities/facture/service/facture.service';

@Component({
  selector: 'jhi-paiment-facture-update',
  templateUrl: './paiment-facture-update.component.html',
})
export class PaimentFactureUpdateComponent implements OnInit {
  isSaving = false;

  facturesSharedCollection: IFacture[] = [];

  editForm = this.fb.group({
    id: [],
    referance: [null, [Validators.required]],
    factures: [],
  });

  constructor(
    protected paimentFactureService: PaimentFactureService,
    protected factureService: FactureService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paimentFacture }) => {
      this.updateForm(paimentFacture);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paimentFacture = this.createFromForm();
    if (paimentFacture.id !== undefined) {
      this.subscribeToSaveResponse(this.paimentFactureService.update(paimentFacture));
    } else {
      this.subscribeToSaveResponse(this.paimentFactureService.create(paimentFacture));
    }
  }

  trackFactureById(_index: number, item: IFacture): number {
    return item.id!;
  }

  getSelectedFacture(option: IFacture, selectedVals?: IFacture[]): IFacture {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaimentFacture>>): void {
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

  protected updateForm(paimentFacture: IPaimentFacture): void {
    this.editForm.patchValue({
      id: paimentFacture.id,
      referance: paimentFacture.referance,
      factures: paimentFacture.factures,
    });

    this.facturesSharedCollection = this.factureService.addFactureToCollectionIfMissing(
      this.facturesSharedCollection,
      ...(paimentFacture.factures ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.factureService
      .query()
      .pipe(map((res: HttpResponse<IFacture[]>) => res.body ?? []))
      .pipe(
        map((factures: IFacture[]) =>
          this.factureService.addFactureToCollectionIfMissing(factures, ...(this.editForm.get('factures')!.value ?? []))
        )
      )
      .subscribe((factures: IFacture[]) => (this.facturesSharedCollection = factures));
  }

  protected createFromForm(): IPaimentFacture {
    return {
      ...new PaimentFacture(),
      id: this.editForm.get(['id'])!.value,
      referance: this.editForm.get(['referance'])!.value,
      factures: this.editForm.get(['factures'])!.value,
    };
  }
}
