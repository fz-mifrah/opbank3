import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFacture, Facture } from '../facture.model';
import { FactureService } from '../service/facture.service';

@Component({
  selector: 'jhi-facture-update',
  templateUrl: './facture-update.component.html',
})
export class FactureUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
  });

  constructor(protected factureService: FactureService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facture }) => {
      this.updateForm(facture);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const facture = this.createFromForm();
    if (facture.id !== undefined) {
      this.subscribeToSaveResponse(this.factureService.update(facture));
    } else {
      this.subscribeToSaveResponse(this.factureService.create(facture));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFacture>>): void {
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

  protected updateForm(facture: IFacture): void {
    this.editForm.patchValue({
      id: facture.id,
      nom: facture.nom,
    });
  }

  protected createFromForm(): IFacture {
    return {
      ...new Facture(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
    };
  }
}
