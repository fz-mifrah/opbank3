import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DestinataireService } from '../service/destinataire.service';
import { IDestinataire, Destinataire } from '../destinataire.model';

import { DestinataireUpdateComponent } from './destinataire-update.component';

describe('Destinataire Management Update Component', () => {
  let comp: DestinataireUpdateComponent;
  let fixture: ComponentFixture<DestinataireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let destinataireService: DestinataireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DestinataireUpdateComponent],
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
      .overrideTemplate(DestinataireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DestinataireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    destinataireService = TestBed.inject(DestinataireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const destinataire: IDestinataire = { id: 456 };

      activatedRoute.data = of({ destinataire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(destinataire));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Destinataire>>();
      const destinataire = { id: 123 };
      jest.spyOn(destinataireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ destinataire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: destinataire }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(destinataireService.update).toHaveBeenCalledWith(destinataire);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Destinataire>>();
      const destinataire = new Destinataire();
      jest.spyOn(destinataireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ destinataire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: destinataire }));
      saveSubject.complete();

      // THEN
      expect(destinataireService.create).toHaveBeenCalledWith(destinataire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Destinataire>>();
      const destinataire = { id: 123 };
      jest.spyOn(destinataireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ destinataire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(destinataireService.update).toHaveBeenCalledWith(destinataire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
