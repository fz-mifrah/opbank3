import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaimentFactureService } from '../service/paiment-facture.service';
import { IPaimentFacture, PaimentFacture } from '../paiment-facture.model';
import { IFacture } from 'app/entities/facture/facture.model';
import { FactureService } from 'app/entities/facture/service/facture.service';

import { PaimentFactureUpdateComponent } from './paiment-facture-update.component';

describe('PaimentFacture Management Update Component', () => {
  let comp: PaimentFactureUpdateComponent;
  let fixture: ComponentFixture<PaimentFactureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paimentFactureService: PaimentFactureService;
  let factureService: FactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaimentFactureUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PaimentFactureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaimentFactureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paimentFactureService = TestBed.inject(PaimentFactureService);
    factureService = TestBed.inject(FactureService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Facture query and add missing value', () => {
      const paimentFacture: IPaimentFacture = { id: 456 };
      const factures: IFacture[] = [{ id: 62538 }];
      paimentFacture.factures = factures;

      const factureCollection: IFacture[] = [{ id: 84180 }];
      jest.spyOn(factureService, 'query').mockReturnValue(of(new HttpResponse({ body: factureCollection })));
      const additionalFactures = [...factures];
      const expectedCollection: IFacture[] = [...additionalFactures, ...factureCollection];
      jest.spyOn(factureService, 'addFactureToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paimentFacture });
      comp.ngOnInit();

      expect(factureService.query).toHaveBeenCalled();
      expect(factureService.addFactureToCollectionIfMissing).toHaveBeenCalledWith(factureCollection, ...additionalFactures);
      expect(comp.facturesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paimentFacture: IPaimentFacture = { id: 456 };
      const factures: IFacture = { id: 18630 };
      paimentFacture.factures = [factures];

      activatedRoute.data = of({ paimentFacture });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paimentFacture));
      expect(comp.facturesSharedCollection).toContain(factures);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaimentFacture>>();
      const paimentFacture = { id: 123 };
      jest.spyOn(paimentFactureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paimentFacture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paimentFacture }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paimentFactureService.update).toHaveBeenCalledWith(paimentFacture);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaimentFacture>>();
      const paimentFacture = new PaimentFacture();
      jest.spyOn(paimentFactureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paimentFacture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paimentFacture }));
      saveSubject.complete();

      // THEN
      expect(paimentFactureService.create).toHaveBeenCalledWith(paimentFacture);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaimentFacture>>();
      const paimentFacture = { id: 123 };
      jest.spyOn(paimentFactureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paimentFacture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paimentFactureService.update).toHaveBeenCalledWith(paimentFacture);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFactureById', () => {
      it('Should return tracked Facture primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFactureById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedFacture', () => {
      it('Should return option if no Facture is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedFacture(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Facture for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedFacture(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Facture is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedFacture(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
