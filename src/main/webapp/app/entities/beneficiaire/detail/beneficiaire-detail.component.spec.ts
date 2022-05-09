import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BeneficiaireDetailComponent } from './beneficiaire-detail.component';

describe('Beneficiaire Management Detail Component', () => {
  let comp: BeneficiaireDetailComponent;
  let fixture: ComponentFixture<BeneficiaireDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiaireDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ beneficiaire: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BeneficiaireDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BeneficiaireDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load beneficiaire on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.beneficiaire).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
