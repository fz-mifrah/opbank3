import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVirement, Virement } from '../virement.model';
import { VirementService } from '../service/virement.service';
import { IDestinataire } from 'app/entities/destinataire/destinataire.model';
import { DestinataireService } from 'app/entities/destinataire/service/destinataire.service';
import { IBeneficiaire } from 'app/entities/beneficiaire/beneficiaire.model';
import { BeneficiaireService } from 'app/entities/beneficiaire/service/beneficiaire.service';

@Component({
  selector: 'jhi-virement-update',
  templateUrl: './virement-update.component.html',
})
export class VirementUpdateComponent implements OnInit {
  isSaving = false;

  destinatairesSharedCollection: IDestinataire[] = [];
  beneficiairesSharedCollection: IBeneficiaire[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    destinataire: [],
    beneficiaire: [],
  });

  constructor(
    protected virementService: VirementService,
    protected destinataireService: DestinataireService,
    protected beneficiaireService: BeneficiaireService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ virement }) => {
      this.updateForm(virement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const virement = this.createFromForm();
    if (virement.id !== undefined) {
      this.subscribeToSaveResponse(this.virementService.update(virement));
    } else {
      this.subscribeToSaveResponse(this.virementService.create(virement));
    }
  }

  trackDestinataireById(_index: number, item: IDestinataire): number {
    return item.id!;
  }

  trackBeneficiaireById(_index: number, item: IBeneficiaire): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVirement>>): void {
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

  protected updateForm(virement: IVirement): void {
    this.editForm.patchValue({
      id: virement.id,
      description: virement.description,
      destinataire: virement.destinataire,
      beneficiaire: virement.beneficiaire,
    });

    this.destinatairesSharedCollection = this.destinataireService.addDestinataireToCollectionIfMissing(
      this.destinatairesSharedCollection,
      virement.destinataire
    );
    this.beneficiairesSharedCollection = this.beneficiaireService.addBeneficiaireToCollectionIfMissing(
      this.beneficiairesSharedCollection,
      virement.beneficiaire
    );
  }

  protected loadRelationshipsOptions(): void {
    this.destinataireService
      .query()
      .pipe(map((res: HttpResponse<IDestinataire[]>) => res.body ?? []))
      .pipe(
        map((destinataires: IDestinataire[]) =>
          this.destinataireService.addDestinataireToCollectionIfMissing(destinataires, this.editForm.get('destinataire')!.value)
        )
      )
      .subscribe((destinataires: IDestinataire[]) => (this.destinatairesSharedCollection = destinataires));

    this.beneficiaireService
      .query()
      .pipe(map((res: HttpResponse<IBeneficiaire[]>) => res.body ?? []))
      .pipe(
        map((beneficiaires: IBeneficiaire[]) =>
          this.beneficiaireService.addBeneficiaireToCollectionIfMissing(beneficiaires, this.editForm.get('beneficiaire')!.value)
        )
      )
      .subscribe((beneficiaires: IBeneficiaire[]) => (this.beneficiairesSharedCollection = beneficiaires));
  }

  protected createFromForm(): IVirement {
    return {
      ...new Virement(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      destinataire: this.editForm.get(['destinataire'])!.value,
      beneficiaire: this.editForm.get(['beneficiaire'])!.value,
    };
  }
}
