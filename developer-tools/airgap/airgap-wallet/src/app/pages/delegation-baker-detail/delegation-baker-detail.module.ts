import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { TranslateModule } from '@ngx-translate/core'
import { MomentModule } from 'ngx-moment'

import { ComponentsModule } from '../../components/components.module'
import { PipesModule } from '../../pipes/pipes.module'

import { DelegationBakerDetailPage } from './delegation-baker-detail'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    TranslateModule,
    PipesModule,
    MomentModule,
    RouterModule.forChild([{ path: '', component: DelegationBakerDetailPage }])
  ],
  declarations: [DelegationBakerDetailPage]
})
export class DelegationBakerDetailPageModule {}
