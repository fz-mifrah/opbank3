import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDestinataire, Destinataire } from '../destinataire.model';
import { DestinataireService } from '../service/destinataire.service';
import { IVirement } from 'app/entities/virement/virement.model';
import { VirementService } from 'app/entities/virement/service/virement.service';

@Component({
  selector: 'jhi-destinataire-update',
  templateUrl: './destinataire-update.component.html',
})
export class DestinataireUpdateComponent implements OnInit {
  isSaving = false;

  virementsSharedCollection: IVirement[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    prenom: [null, [Validators.required]],
    rib: [null, [Validators.required]],
    virement: [],
  });

  constructor(
    protected destinataireService: DestinataireService,
    protected virementService: VirementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ destinataire }) => {
      this.updateForm(destinataire);

      this.loadRelationshipsOptions();
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

  trackVirementById(_index: number, item: IVirement): number {
    return item.id!;
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
      virement: destinataire.virement,
    });

    this.virementsSharedCollection = this.virementService.addVirementToCollectionIfMissing(
      this.virementsSharedCollection,
      destinataire.virement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.virementService
      .query()
      .pipe(map((res: HttpResponse<IVirement[]>) => res.body ?? []))
      .pipe(
        map((virements: IVirement[]) =>
          this.virementService.addVirementToCollectionIfMissing(virements, this.editForm.get('virement')!.value)
        )
      )
      .subscribe((virements: IVirement[]) => (this.virementsSharedCollection = virements));
  }

  protected createFromForm(): IDestinataire {
    return {
      ...new Destinataire(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      rib: this.editForm.get(['rib'])!.value,
      virement: this.editForm.get(['virement'])!.value,
    };
  }
}
