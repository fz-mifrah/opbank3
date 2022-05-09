import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDestinataire, Destinataire } from '../destinataire.model';
import { DestinataireService } from '../service/destinataire.service';

@Injectable({ providedIn: 'root' })
export class DestinataireRoutingResolveService implements Resolve<IDestinataire> {
  constructor(protected service: DestinataireService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDestinataire> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((destinataire: HttpResponse<Destinataire>) => {
          if (destinataire.body) {
            return of(destinataire.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Destinataire());
  }
}
