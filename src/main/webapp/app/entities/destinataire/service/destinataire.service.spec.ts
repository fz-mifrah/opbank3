import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDestinataire, Destinataire } from '../destinataire.model';

import { DestinataireService } from './destinataire.service';

describe('Destinataire Service', () => {
  let service: DestinataireService;
  let httpMock: HttpTestingController;
  let elemDefault: IDestinataire;
  let expectedResult: IDestinataire | IDestinataire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DestinataireService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      prenom: 'AAAAAAA',
      rib: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Destinataire', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Destinataire()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Destinataire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          rib: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Destinataire', () => {
      const patchObject = Object.assign(
        {
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          rib: 1,
        },
        new Destinataire()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Destinataire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          prenom: 'BBBBBB',
          rib: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Destinataire', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDestinataireToCollectionIfMissing', () => {
      it('should add a Destinataire to an empty array', () => {
        const destinataire: IDestinataire = { id: 123 };
        expectedResult = service.addDestinataireToCollectionIfMissing([], destinataire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(destinataire);
      });

      it('should not add a Destinataire to an array that contains it', () => {
        const destinataire: IDestinataire = { id: 123 };
        const destinataireCollection: IDestinataire[] = [
          {
            ...destinataire,
          },
          { id: 456 },
        ];
        expectedResult = service.addDestinataireToCollectionIfMissing(destinataireCollection, destinataire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Destinataire to an array that doesn't contain it", () => {
        const destinataire: IDestinataire = { id: 123 };
        const destinataireCollection: IDestinataire[] = [{ id: 456 }];
        expectedResult = service.addDestinataireToCollectionIfMissing(destinataireCollection, destinataire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(destinataire);
      });

      it('should add only unique Destinataire to an array', () => {
        const destinataireArray: IDestinataire[] = [{ id: 123 }, { id: 456 }, { id: 83962 }];
        const destinataireCollection: IDestinataire[] = [{ id: 123 }];
        expectedResult = service.addDestinataireToCollectionIfMissing(destinataireCollection, ...destinataireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const destinataire: IDestinataire = { id: 123 };
        const destinataire2: IDestinataire = { id: 456 };
        expectedResult = service.addDestinataireToCollectionIfMissing([], destinataire, destinataire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(destinataire);
        expect(expectedResult).toContain(destinataire2);
      });

      it('should accept null and undefined values', () => {
        const destinataire: IDestinataire = { id: 123 };
        expectedResult = service.addDestinataireToCollectionIfMissing([], null, destinataire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(destinataire);
      });

      it('should return initial array if no Destinataire is added', () => {
        const destinataireCollection: IDestinataire[] = [{ id: 123 }];
        expectedResult = service.addDestinataireToCollectionIfMissing(destinataireCollection, undefined, null);
        expect(expectedResult).toEqual(destinataireCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
