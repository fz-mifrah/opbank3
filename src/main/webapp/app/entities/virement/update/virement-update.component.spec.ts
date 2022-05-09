import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VirementService } from '../service/virement.service';
import { IVirement, Virement } from '../virement.model';

import { VirementUpdateComponent } from './virement-update.component';

describe('Virement Management Update Component', () => {
  let comp: VirementUpdateComponent;
  let fixture: ComponentFixture<VirementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let virementService: VirementService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const virement: IVirement = { id: 456 };

      activatedRoute.data = of({ virement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(virement));
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
});
