import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDestinataire, getDestinataireIdentifier } from '../destinataire.model';

export type EntityResponseType = HttpResponse<IDestinataire>;
export type EntityArrayResponseType = HttpResponse<IDestinataire[]>;

@Injectable({ providedIn: 'root' })
export class DestinataireService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/destinataires');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(destinataire: IDestinataire): Observable<EntityResponseType> {
    return this.http.post<IDestinataire>(this.resourceUrl, destinataire, { observe: 'response' });
  }

  update(destinataire: IDestinataire): Observable<EntityResponseType> {
    return this.http.put<IDestinataire>(`${this.resourceUrl}/${getDestinataireIdentifier(destinataire) as number}`, destinataire, {
      observe: 'response',
    });
  }

  partialUpdate(destinataire: IDestinataire): Observable<EntityResponseType> {
    return this.http.patch<IDestinataire>(`${this.resourceUrl}/${getDestinataireIdentifier(destinataire) as number}`, destinataire, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDestinataire>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDestinataire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDestinataireToCollectionIfMissing(
    destinataireCollection: IDestinataire[],
    ...destinatairesToCheck: (IDestinataire | null | undefined)[]
  ): IDestinataire[] {
    const destinataires: IDestinataire[] = destinatairesToCheck.filter(isPresent);
    if (destinataires.length > 0) {
      const destinataireCollectionIdentifiers = destinataireCollection.map(
        destinataireItem => getDestinataireIdentifier(destinataireItem)!
      );
      const destinatairesToAdd = destinataires.filter(destinataireItem => {
        const destinataireIdentifier = getDestinataireIdentifier(destinataireItem);
        if (destinataireIdentifier == null || destinataireCollectionIdentifiers.includes(destinataireIdentifier)) {
          return false;
        }
        destinataireCollectionIdentifiers.push(destinataireIdentifier);
        return true;
      });
      return [...destinatairesToAdd, ...destinataireCollection];
    }
    return destinataireCollection;
  }
}
