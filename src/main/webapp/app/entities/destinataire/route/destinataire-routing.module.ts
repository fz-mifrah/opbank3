import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DestinataireComponent } from '../list/destinataire.component';
import { DestinataireDetailComponent } from '../detail/destinataire-detail.component';
import { DestinataireUpdateComponent } from '../update/destinataire-update.component';
import { DestinataireRoutingResolveService } from './destinataire-routing-resolve.service';

const destinataireRoute: Routes = [
  {
    path: '',
    component: DestinataireComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DestinataireDetailComponent,
    resolve: {
      destinataire: DestinataireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DestinataireUpdateComponent,
    resolve: {
      destinataire: DestinataireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DestinataireUpdateComponent,
    resolve: {
      destinataire: DestinataireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(destinataireRoute)],
  exports: [RouterModule],
})
export class DestinataireRoutingModule {}
