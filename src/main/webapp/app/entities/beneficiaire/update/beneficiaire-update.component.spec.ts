import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BeneficiaireService } from '../service/beneficiaire.service';
import { IBeneficiaire, Beneficiaire } from '../beneficiaire.model';
import { IVirement } from 'app/entities/virement/virement.model';
import { VirementService } from 'app/entities/virement/service/virement.service';

import { BeneficiaireUpdateComponent } from './beneficiaire-update.component';

describe('Beneficiaire Management Update Component', () => {
  let comp: BeneficiaireUpdateComponent;
  let fixture: ComponentFixture<BeneficiaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let beneficiaireService: BeneficiaireService;
  let virementService: VirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BeneficiaireUpdateComponent],
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
      .overrideTemplate(BeneficiaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BeneficiaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    beneficiaireService = TestBed.inject(BeneficiaireService);
    virementService = TestBed.inject(VirementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Virement query and add missing value', () => {
      const beneficiaire: IBeneficiaire = { id: 456 };
      const virement: IVirement = { id: 64623 };
      beneficiaire.virement = virement;

      const virementCollection: IVirement[] = [{ id: 42963 }];
      jest.spyOn(virementService, 'query').mockReturnValue(of(new HttpResponse({ body: virementCollection })));
      const additionalVirements = [virement];
      const expectedCollection: IVirement[] = [...additionalVirements, ...virementCollection];
      jest.spyOn(virementService, 'addVirementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ beneficiaire });
      comp.ngOnInit();

      expect(virementService.query).toHaveBeenCalled();
      expect(virementService.addVirementToCollectionIfMissing).toHaveBeenCalledWith(virementCollection, ...additionalVirements);
      expect(comp.virementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const beneficiaire: IBeneficiaire = { id: 456 };
      const virement: IVirement = { id: 6185 };
      beneficiaire.virement = virement;

      activatedRoute.data = of({ beneficiaire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(beneficiaire));
      expect(comp.virementsSharedCollection).toContain(virement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Beneficiaire>>();
      const beneficiaire = { id: 123 };
      jest.spyOn(beneficiaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ beneficiaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: beneficiaire }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(beneficiaireService.update).toHaveBeenCalledWith(beneficiaire);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Beneficiaire>>();
      const beneficiaire = new Beneficiaire();
      jest.spyOn(beneficiaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ beneficiaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: beneficiaire }));
      saveSubject.complete();

      // THEN
      expect(beneficiaireService.create).toHaveBeenCalledWith(beneficiaire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Beneficiaire>>();
      const beneficiaire = { id: 123 };
      jest.spyOn(beneficiaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ beneficiaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(beneficiaireService.update).toHaveBeenCalledWith(beneficiaire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackVirementById', () => {
      it('Should return tracked Virement primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVirementById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
