import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBeneficiaire } from '../beneficiaire.model';
import { BeneficiaireService } from '../service/beneficiaire.service';
import { BeneficiaireDeleteDialogComponent } from '../delete/beneficiaire-delete-dialog.component';

@Component({
  selector: 'jhi-beneficiaire',
  templateUrl: './beneficiaire.component.html',
})
export class BeneficiaireComponent implements OnInit {
  beneficiaires?: IBeneficiaire[];
  isLoading = false;

  constructor(protected beneficiaireService: BeneficiaireService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.beneficiaireService.query().subscribe({
      next: (res: HttpResponse<IBeneficiaire[]>) => {
        this.isLoading = false;
        this.beneficiaires = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IBeneficiaire): number {
    return item.id!;
  }

  delete(beneficiaire: IBeneficiaire): void {
    const modalRef = this.modalService.open(BeneficiaireDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.beneficiaire = beneficiaire;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
