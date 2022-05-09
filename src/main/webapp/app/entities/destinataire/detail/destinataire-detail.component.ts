import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDestinataire } from '../destinataire.model';

@Component({
  selector: 'jhi-destinataire-detail',
  templateUrl: './destinataire-detail.component.html',
})
export class DestinataireDetailComponent implements OnInit {
  destinataire: IDestinataire | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ destinataire }) => {
      this.destinataire = destinataire;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
