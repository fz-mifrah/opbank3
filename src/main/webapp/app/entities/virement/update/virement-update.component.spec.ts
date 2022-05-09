import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VirementService } from '../service/virement.service';
import { IVirement, Virement } from '../virement.model';
import { IDestinataire } from 'app/entities/destinataire/destinataire.model';
import { DestinataireService } from 'app/entities/destinataire/service/destinataire.service';
import { IBeneficiaire } from 'app/entities/beneficiaire/beneficiaire.model';
import { BeneficiaireService } from 'app/entities/beneficiaire/service/beneficiaire.service';

import { VirementUpdateComponent } from './virement-update.component';

describe('Virement Management Update Component', () => {
  let comp: VirementUpdateComponent;
  let fixture: ComponentFixture<VirementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let virementService: VirementService;
  let destinataireService: DestinataireService;
  let beneficiaireService: BeneficiaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VirementUpdateComponent],
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
      .overrideTemplate(VirementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VirementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    virementService = TestBed.inject(VirementService);
    destinataireService = TestBed.inject(DestinataireService);
    beneficiaireService = TestBed.inject(BeneficiaireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Destinataire query and add missing value', () => {
      const virement: IVirement = { id: 456 };
      const destinataire: IDestinataire = { id: 35432 };
      virement.destinataire = destinataire;

      const destinataireCollection: IDestinataire[] = [{ id: 7448 }];
      jest.spyOn(destinataireService, 'query').mockReturnValue(of(new HttpResponse({ body: destinataireCollection })));
      const additionalDestinataires = [destinataire];
      const expectedCollection: IDestinataire[] = [...additionalDestinataires, ...destinataireCollection];
      jest.spyOn(destinataireService, 'addDestinataireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ virement });
      comp.ngOnInit();

      expect(destinataireService.query).toHaveBeenCalled();
      expect(destinataireService.addDestinataireToCollectionIfMissing).toHaveBeenCalledWith(
        destinataireCollection,
        ...additionalDestinataires
      );
      expect(comp.destinatairesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Beneficiaire query and add missing value', () => {
      const virement: IVirement = { id: 456 };
      const beneficiaire: IBeneficiaire = { id: 67182 };
      virement.beneficiaire = beneficiaire;

      const beneficiaireCollection: IBeneficiaire[] = [{ id: 33415 }];
      jest.spyOn(beneficiaireService, 'query').mockReturnValue(of(new HttpResponse({ body: beneficiaireCollection })));
      const additionalBeneficiaires = [beneficiaire];
      const expectedCollection: IBeneficiaire[] = [...additionalBeneficiaires, ...beneficiaireCollection];
      jest.spyOn(beneficiaireService, 'addBeneficiaireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ virement });
      comp.ngOnInit();

      expect(beneficiaireService.query).toHaveBeenCalled();
      expect(beneficiaireService.addBeneficiaireToCollectionIfMissing).toHaveBeenCalledWith(
        beneficiaireCollection,
        ...additionalBeneficiaires
      );
      expect(comp.beneficiairesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const virement: IVirement = { id: 456 };
      const destinataire: IDestinataire = { id: 76631 };
      virement.destinataire = destinataire;
      const beneficiaire: IBeneficiaire = { id: 6615 };
      virement.beneficiaire = beneficiaire;

      activatedRoute.data = of({ virement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(virement));
      expect(comp.destinatairesSharedCollection).toContain(destinataire);
      expect(comp.beneficiairesSharedCollection).toContain(beneficiaire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Virement>>();
      const virement = { id: 123 };
      jest.spyOn(virementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ virement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: virement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(virementService.update).toHaveBeenCalledWith(virement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Virement>>();
      const virement = new Virement();
      jest.spyOn(virementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ virement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: virement }));
      saveSubject.complete();

      // THEN
      expect(virementService.create).toHaveBeenCalledWith(virement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Virement>>();
      const virement = { id: 123 };
      jest.spyOn(virementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ virement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(virementService.update).toHaveBeenCalledWith(virement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDestinataireById', () => {
      it('Should return tracked Destinataire primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDestinataireById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBeneficiaireById', () => {
      it('Should return tracked Beneficiaire primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBeneficiaireById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
