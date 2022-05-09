import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDestinataire, Destinataire } from '../destinataire.model';
import { DestinataireService } from '../service/destinataire.service';

@Component({
  selector: 'jhi-destinataire-update',
  templateUrl: './destinataire-update.component.html',
})
export class DestinataireUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    prenom: [null, [Validators.required]],
    rib: [null, [Validators.required]],
  });

  constructor(protected destinataireService: DestinataireService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ destinataire }) => {
      this.updateForm(destinataire);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const destinataire = this.createFromForm();
    if (destinataire.id !== undefined) {
      this.subscribeToSaveResponse(this.destinataireService.update(destinataire));
    } else {
      this.subscribeToSaveResponse(this.destinataireService.create(destinataire));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDestinataire>>): void {
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

  protected updateForm(destinataire: IDestinataire): void {
    this.editForm.patchValue({
      id: destinataire.id,
      nom: destinataire.nom,
      prenom: destinataire.prenom,
      rib: destinataire.rib,
    });
  }

  protected createFromForm(): IDestinataire {
    return {
      ...new Destinataire(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      rib: this.editForm.get(['rib'])!.value,
    };
  }
}
