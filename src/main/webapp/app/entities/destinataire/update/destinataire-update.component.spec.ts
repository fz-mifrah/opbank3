import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DestinataireService } from '../service/destinataire.service';
import { IDestinataire, Destinataire } from '../destinataire.model';
import { IVirement } from 'app/entities/virement/virement.model';
import { VirementService } from 'app/entities/virement/service/virement.service';

import { DestinataireUpdateComponent } from './destinataire-update.component';

describe('Destinataire Management Update Component', () => {
  let comp: DestinataireUpdateComponent;
  let fixture: ComponentFixture<DestinataireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let destinataireService: DestinataireService;
  let virementService: VirementService;

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
    virementService = TestBed.inject(VirementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Virement query and add missing value', () => {
      const destinataire: IDestinataire = { id: 456 };
      const virement: IVirement = { id: 45754 };
      destinataire.virement = virement;

      const virementCollection: IVirement[] = [{ id: 12864 }];
      jest.spyOn(virementService, 'query').mockReturnValue(of(new HttpResponse({ body: virementCollection })));
      const additionalVirements = [virement];
      const expectedCollection: IVirement[] = [...additionalVirements, ...virementCollection];
      jest.spyOn(virementService, 'addVirementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ destinataire });
      comp.ngOnInit();

      expect(virementService.query).toHaveBeenCalled();
      expect(virementService.addVirementToCollectionIfMissing).toHaveBeenCalledWith(virementCollection, ...additionalVirements);
      expect(comp.virementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const destinataire: IDestinataire = { id: 456 };
      const virement: IVirement = { id: 90468 };
      destinataire.virement = virement;

      activatedRoute.data = of({ destinataire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(destinataire));
      expect(comp.virementsSharedCollection).toContain(virement);
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
