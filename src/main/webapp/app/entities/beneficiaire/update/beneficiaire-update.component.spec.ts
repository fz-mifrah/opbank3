import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BeneficiaireService } from '../service/beneficiaire.service';
import { IBeneficiaire, Beneficiaire } from '../beneficiaire.model';

import { BeneficiaireUpdateComponent } from './beneficiaire-update.component';

describe('Beneficiaire Management Update Component', () => {
  let comp: BeneficiaireUpdateComponent;
  let fixture: ComponentFixture<BeneficiaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let beneficiaireService: BeneficiaireService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const beneficiaire: IBeneficiaire = { id: 456 };

      activatedRoute.data = of({ beneficiaire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(beneficiaire));
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
});
