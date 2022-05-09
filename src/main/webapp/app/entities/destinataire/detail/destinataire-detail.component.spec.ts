import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DestinataireDetailComponent } from './destinataire-detail.component';

describe('Destinataire Management Detail Component', () => {
  let comp: DestinataireDetailComponent;
  let fixture: ComponentFixture<DestinataireDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinataireDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ destinataire: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DestinataireDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DestinataireDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load destinataire on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.destinataire).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
