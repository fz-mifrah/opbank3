import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFacture } from '../facture.model';
import { FactureService } from '../service/facture.service';
import { FactureDeleteDialogComponent } from '../delete/facture-delete-dialog.component';

@Component({
  selector: 'jhi-facture',
  templateUrl: './facture.component.html',
})
export class FactureComponent implements OnInit {
  factures?: IFacture[];
  isLoading = false;

  constructor(protected factureService: FactureService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.factureService.query().subscribe({
      next: (res: HttpResponse<IFacture[]>) => {
        this.isLoading = false;
        this.factures = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFacture): number {
    return item.id!;
  }

  delete(facture: IFacture): void {
    const modalRef = this.modalService.open(FactureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.facture = facture;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
