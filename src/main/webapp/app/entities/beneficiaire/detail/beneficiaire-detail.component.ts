import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBeneficiaire } from '../beneficiaire.model';

@Component({
  selector: 'jhi-beneficiaire-detail',
  templateUrl: './beneficiaire-detail.component.html',
})
export class BeneficiaireDetailComponent implements OnInit {
  beneficiaire: IBeneficiaire | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ beneficiaire }) => {
      this.beneficiaire = beneficiaire;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
