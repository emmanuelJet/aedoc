import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular'
import { Secret } from '../../models/secret'
import { InteractionSetting } from '../../providers/interaction/interaction'
import { SecretsProvider } from '../../providers/secrets/secrets.provider'
import { SocialRecoverySetupPage } from '../social-recovery-setup/social-recovery-setup'
import { SecretEditPopoverComponent } from './secret-edit-popover/secret-edit-popover.component'
import { WalletSelectCoinsPage } from '../wallet-select-coins/wallet-select-coins'
import { handleErrorLocal, ErrorCategory } from '../../providers/error-handler/error-handler'
import { InteractionSelectionSettingsPage } from '../interaction-selection-settings/interaction-selection-settings'

@IonicPage()
@Component({
  selector: 'page-secret-edit',
  templateUrl: 'secret-edit.html'
})
export class SecretEditPage {
  isGenerating: boolean = false
  public interactionSetting: boolean = false

  private secret: Secret

  constructor(
    public navController: NavController,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    private secretsProvider: SecretsProvider
  ) {
    this.secret = this.navParams.get('secret')
    this.isGenerating = this.navParams.get('isGenerating')

    this.interactionSetting = this.secret.interactionSetting !== InteractionSetting.UNDETERMINED
  }

  confirm() {
    this.secretsProvider
      .addOrUpdateSecret(this.secret)
      .then(async () => {
        await this.dismiss()
        if (this.isGenerating) {
          this.navController.push(WalletSelectCoinsPage).catch(handleErrorLocal(ErrorCategory.IONIC_NAVIGATION))
        }
      })
      .catch(handleErrorLocal(ErrorCategory.SECURE_STORAGE))
  }

  dismiss() {
    return this.navController.popToRoot()
  }

  goToSocialRecoverySetup() {
    this.navController.push(SocialRecoverySetupPage, { secret: this.secret }).catch(handleErrorLocal(ErrorCategory.IONIC_NAVIGATION))
  }

  goToWalletInteraction() {
    this.navController
      .push(InteractionSelectionSettingsPage, { secret: this.secret, isEdit: true })
      .catch(handleErrorLocal(ErrorCategory.IONIC_NAVIGATION))
  }

  presentEditPopover(event) {
    let popover = this.popoverCtrl.create(SecretEditPopoverComponent, {
      secret: this.secret,
      onDelete: () => {
        this.dismiss().catch(handleErrorLocal(ErrorCategory.IONIC_MODAL))
      }
    })
    popover
      .present({
        ev: event
      })
      .catch(handleErrorLocal(ErrorCategory.IONIC_MODAL))
  }
}
