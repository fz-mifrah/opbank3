import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaimentFactureService } from '../service/paiment-facture.service';
import { IPaimentFacture, PaimentFacture } from '../paiment-facture.model';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

import { PaimentFactureUpdateComponent } from './paiment-facture-update.component';

describe('PaimentFacture Management Update Component', () => {
  let comp: PaimentFactureUpdateComponent;
  let fixture: ComponentFixture<PaimentFactureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paimentFactureService: PaimentFactureService;
  let serviceService: ServiceService;

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
    serviceService = TestBed.inject(ServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Service query and add missing value', () => {
      const paimentFacture: IPaimentFacture = { id: 456 };
      const services: IService[] = [{ id: 63796 }];
      paimentFacture.services = services;

      const serviceCollection: IService[] = [{ id: 72692 }];
      jest.spyOn(serviceService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCollection })));
      const additionalServices = [...services];
      const expectedCollection: IService[] = [...additionalServices, ...serviceCollection];
      jest.spyOn(serviceService, 'addServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paimentFacture });
      comp.ngOnInit();

      expect(serviceService.query).toHaveBeenCalled();
      expect(serviceService.addServiceToCollectionIfMissing).toHaveBeenCalledWith(serviceCollection, ...additionalServices);
      expect(comp.servicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paimentFacture: IPaimentFacture = { id: 456 };
      const services: IService = { id: 24838 };
      paimentFacture.services = [services];

      activatedRoute.data = of({ paimentFacture });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paimentFacture));
      expect(comp.servicesSharedCollection).toContain(services);
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
    describe('trackServiceById', () => {
      it('Should return tracked Service primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackServiceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedService', () => {
      it('Should return option if no Service is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedService(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Service for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedService(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Service is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedService(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
