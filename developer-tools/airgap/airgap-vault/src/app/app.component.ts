import { Component, ViewChild, NgZone } from '@angular/core'
import { Platform, Nav } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { TabsPage } from '../pages/tabs/tabs'
import { Deeplinks } from '@ionic-native/deeplinks'
import { StartupChecksProvider } from '../providers/startup-checks/startup-checks.provider'
import { SchemeRoutingProvider } from '../providers/scheme-routing/scheme-routing'
import { TranslateService } from '@ngx-translate/core'
import { ProtocolsProvider } from '../providers/protocols/protocols'
import { SecretsProvider } from '../providers/secrets/secrets.provider'
import { handleErrorLocal, ErrorCategory } from '../providers/error-handler/error-handler'
import { WalletSelectCoinsPage } from '../pages/wallet-select-coins/wallet-select-coins'
import { SecretCreatePage } from '../pages/secret-create/secret-create'

const DEEPLINK_VAULT_PREFIX = `airgap-vault://`
const DEEPLINK_VAULT_ADD_ACCOUNT = `${DEEPLINK_VAULT_PREFIX}add-account/`

interface ExposedPromise<T> {
  promise: Promise<T>
  resolve: (value?: any | PromiseLike<void>) => void
  reject: (reason?: any) => void
}

function exposedPromise<T>(): ExposedPromise<T> {
  let resolve, reject

  // tslint:disable-next-line:promise-must-complete
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav

  rootPage: any = null

  // Sometimes the deeplink was registered before the root page was set
  // This resulted in the root page "overwriting" the deep-linked page
  isInitialized: ExposedPromise<void> = exposedPromise<void>()

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private deepLinks: Deeplinks,
    private startupChecks: StartupChecksProvider,
    private schemeRoutingProvider: SchemeRoutingProvider,
    private translate: TranslateService,
    private protocolsProvider: ProtocolsProvider,
    private secretsProvider: SecretsProvider,
    private ngZone: NgZone
  ) {
    window['airGapHasStarted'] = true
    this.initializeApp().catch(handleErrorLocal(ErrorCategory.OTHER))
  }

  async initializeApp() {
    const supportedLanguages = ['en', 'de', 'zh-cn']
    for (const lang of supportedLanguages) {
      // We bundle languages so we don't have to load it over http
      // and we don't have to add a CSP / whitelist rule for it.
      this.translate.setTranslation(lang, require(`../assets/i18n/${lang}.json`))
      // TODO: Once we add more languages, we probably should not all languages by default
      // (we have to check if we can optimize that)
    }

    this.loadLanguages(supportedLanguages)
    this.protocolsProvider.addProtocols()

    await this.platform.ready()

    if (this.platform.is('cordova')) {
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#311B58')
      this.splashScreen.hide()
    }

    this.initChecks()
  }

  loadLanguages(supportedLanguages: string[]) {
    this.translate.setDefaultLang('en')

    const language = this.translate.getBrowserLang()

    if (language) {
      const lowerCaseLanguage = language.toLowerCase()
      supportedLanguages.forEach(supportedLanguage => {
        if (supportedLanguage.startsWith(lowerCaseLanguage)) {
          this.translate.use(supportedLanguage)
        }
      })
    }
  }

  initChecks() {
    this.startupChecks
      .initChecks()
      .then(async () => {
        await this.nav.setRoot(TabsPage)
        this.isInitialized.resolve()
      })
      .catch(async check => {
        check.consequence(this.initChecks.bind(this))
        this.isInitialized.reject(`startup check failed ${check.name}`) // If we are here, we cannot sign a transaction (no secret, rooted, etc)
      })
  }

  async ngAfterViewInit() {
    await this.platform.ready()
    if (this.platform.is('cordova')) {
      this.deepLinks
        .route({
          '/': undefined
        })
        .subscribe(
          match => {
            // match.$route - the route we matched, which is the matched entry from the arguments to route()
            // match.$args - the args passed in the link
            // match.$link - the full link data
            if (match && match.$link && match.$link.url) {
              this.isInitialized.promise
                .then(async () => {
                  console.log('Successfully matched route', match.$link.url)

                  if (match.$link.url === DEEPLINK_VAULT_PREFIX || match.$link.url.startsWith(DEEPLINK_VAULT_ADD_ACCOUNT)) {
                    if (this.secretsProvider.currentSecretsList.getValue().length > 0) {
                      this.ngZone.run(async () => {
                        await this.nav.popToRoot()
                        const protocol = match.$link.url.substr(DEEPLINK_VAULT_ADD_ACCOUNT.length)
                        if (protocol.length > 0) {
                          this.nav
                            .push(WalletSelectCoinsPage, {
                              protocol: protocol
                            })
                            .catch(handleErrorLocal(ErrorCategory.IONIC_NAVIGATION))
                        } else {
                          this.nav.push(WalletSelectCoinsPage).catch(handleErrorLocal(ErrorCategory.IONIC_NAVIGATION))
                        }
                      })
                    }
                  } else {
                    this.schemeRoutingProvider.handleNewSyncRequest(this.nav, match.$link.url).catch(console.error)
                  }
                })
                .catch(console.error)
            }
          },
          nomatch => {
            // nomatch.$link - the full link data
            if (nomatch && nomatch.$link && nomatch.$link.url) {
              console.error("Got a deeplink that didn't match", nomatch.$link.url)
            }
          }
        )
    }
  }
}
