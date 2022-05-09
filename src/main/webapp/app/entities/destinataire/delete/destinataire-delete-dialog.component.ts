import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDestinataire } from '../destinataire.model';
import { DestinataireService } from '../service/destinataire.service';

@Component({
  templateUrl: './destinataire-delete-dialog.component.html',
})
export class DestinataireDeleteDialogComponent {
  destinataire?: IDestinataire;

  constructor(protected destinataireService: DestinataireService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.destinataireService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
