import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDestinataire } from '../destinataire.model';
import { DestinataireService } from '../service/destinataire.service';
import { DestinataireDeleteDialogComponent } from '../delete/destinataire-delete-dialog.component';

@Component({
  selector: 'jhi-destinataire',
  templateUrl: './destinataire.component.html',
})
export class DestinataireComponent implements OnInit {
  destinataires?: IDestinataire[];
  isLoading = false;

  constructor(protected destinataireService: DestinataireService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.destinataireService.query().subscribe({
      next: (res: HttpResponse<IDestinataire[]>) => {
        this.isLoading = false;
        this.destinataires = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDestinataire): number {
    return item.id!;
  }

  delete(destinataire: IDestinataire): void {
    const modalRef = this.modalService.open(DestinataireDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.destinataire = destinataire;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
