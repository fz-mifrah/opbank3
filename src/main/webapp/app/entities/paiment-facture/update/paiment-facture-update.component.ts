import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaimentFacture, PaimentFacture } from '../paiment-facture.model';
import { PaimentFactureService } from '../service/paiment-facture.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

@Component({
  selector: 'jhi-paiment-facture-update',
  templateUrl: './paiment-facture-update.component.html',
})
export class PaimentFactureUpdateComponent implements OnInit {
  isSaving = false;

  servicesSharedCollection: IService[] = [];

  editForm = this.fb.group({
    id: [],
    referance: [null, [Validators.required]],
    services: [],
  });

  constructor(
    protected paimentFactureService: PaimentFactureService,
    protected serviceService: ServiceService,
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

  trackServiceById(_index: number, item: IService): number {
    return item.id!;
  }

  getSelectedService(option: IService, selectedVals?: IService[]): IService {
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
      services: paimentFacture.services,
    });

    this.servicesSharedCollection = this.serviceService.addServiceToCollectionIfMissing(
      this.servicesSharedCollection,
      ...(paimentFacture.services ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.serviceService
      .query()
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(
        map((services: IService[]) =>
          this.serviceService.addServiceToCollectionIfMissing(services, ...(this.editForm.get('services')!.value ?? []))
        )
      )
      .subscribe((services: IService[]) => (this.servicesSharedCollection = services));
  }

  protected createFromForm(): IPaimentFacture {
    return {
      ...new PaimentFacture(),
      id: this.editForm.get(['id'])!.value,
      referance: this.editForm.get(['referance'])!.value,
      services: this.editForm.get(['services'])!.value,
    };
  }
}
