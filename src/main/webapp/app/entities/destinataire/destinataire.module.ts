import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DestinataireComponent } from './list/destinataire.component';
import { DestinataireDetailComponent } from './detail/destinataire-detail.component';
import { DestinataireUpdateComponent } from './update/destinataire-update.component';
import { DestinataireDeleteDialogComponent } from './delete/destinataire-delete-dialog.component';
import { DestinataireRoutingModule } from './route/destinataire-routing.module';

@NgModule({
  imports: [SharedModule, DestinataireRoutingModule],
  declarations: [DestinataireComponent, DestinataireDetailComponent, DestinataireUpdateComponent, DestinataireDeleteDialogComponent],
  entryComponents: [DestinataireDeleteDialogComponent],
})
export class DestinataireModule {}
