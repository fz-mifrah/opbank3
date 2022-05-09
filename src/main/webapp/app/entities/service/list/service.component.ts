import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IService } from '../service.model';
import { ServiceService } from '../service/service.service';
import { ServiceDeleteDialogComponent } from '../delete/service-delete-dialog.component';

@Component({
  selector: 'jhi-service',
  templateUrl: './service.component.html',
})
export class ServiceComponent implements OnInit {
  services?: IService[];
  isLoading = false;

  constructor(protected serviceService: ServiceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.serviceService.query().subscribe({
      next: (res: HttpResponse<IService[]>) => {
        this.isLoading = false;
        this.services = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IService): number {
    return item.id!;
  }

  delete(service: IService): void {
    const modalRef = this.modalService.open(ServiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.service = service;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
