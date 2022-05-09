import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBeneficiaire, Beneficiaire } from '../beneficiaire.model';
import { BeneficiaireService } from '../service/beneficiaire.service';
import { IVirement } from 'app/entities/virement/virement.model';
import { VirementService } from 'app/entities/virement/service/virement.service';

@Component({
  selector: 'jhi-beneficiaire-update',
  templateUrl: './beneficiaire-update.component.html',
})
export class BeneficiaireUpdateComponent implements OnInit {
  isSaving = false;

  virementsSharedCollection: IVirement[] = [];

  editForm = this.fb.group({
    id: [],
    nomPrenom: [null, [Validators.required]],
    numCompte: [null, [Validators.required]],
    virement: [],
  });

  constructor(
    protected beneficiaireService: BeneficiaireService,
    protected virementService: VirementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ beneficiaire }) => {
      this.updateForm(beneficiaire);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const beneficiaire = this.createFromForm();
    if (beneficiaire.id !== undefined) {
      this.subscribeToSaveResponse(this.beneficiaireService.update(beneficiaire));
    } else {
      this.subscribeToSaveResponse(this.beneficiaireService.create(beneficiaire));
    }
  }

  trackVirementById(_index: number, item: IVirement): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBeneficiaire>>): void {
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

  protected updateForm(beneficiaire: IBeneficiaire): void {
    this.editForm.patchValue({
      id: beneficiaire.id,
      nomPrenom: beneficiaire.nomPrenom,
      numCompte: beneficiaire.numCompte,
      virement: beneficiaire.virement,
    });

    this.virementsSharedCollection = this.virementService.addVirementToCollectionIfMissing(
      this.virementsSharedCollection,
      beneficiaire.virement
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

  protected createFromForm(): IBeneficiaire {
    return {
      ...new Beneficiaire(),
      id: this.editForm.get(['id'])!.value,
      nomPrenom: this.editForm.get(['nomPrenom'])!.value,
      numCompte: this.editForm.get(['numCompte'])!.value,
      virement: this.editForm.get(['virement'])!.value,
    };
  }
}
