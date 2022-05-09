import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IService, Service } from '../service.model';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'jhi-service-update',
  templateUrl: './service-update.component.html',
})
export class ServiceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nomService: [null, [Validators.required]],
  });

  constructor(protected serviceService: ServiceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ service }) => {
      this.updateForm(service);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const service = this.createFromForm();
    if (service.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceService.update(service));
    } else {
      this.subscribeToSaveResponse(this.serviceService.create(service));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IService>>): void {
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

  protected updateForm(service: IService): void {
    this.editForm.patchValue({
      id: service.id,
      nomService: service.nomService,
    });
  }

  protected createFromForm(): IService {
    return {
      ...new Service(),
      id: this.editForm.get(['id'])!.value,
      nomService: this.editForm.get(['nomService'])!.value,
    };
  }
}
