import {
  Component, Directive, Input, ContentChildren, OnInit, OnDestroy, forwardRef, Inject,
  QueryList, SecurityContext
} from '@angular/core';
import { SafeStyle, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { LfLayoutComponent } from '../lf-layout/lf-layout.component';

@Directive({
  selector: '[lfNavigationDrawerMenu]',
})
export class LfNavigationDrawerMenuDirective { }

@Component({
  selector: 'lf-navigation-drawer',
  templateUrl: './lf-navigation-drawer.component.html',
  styleUrls: ['./lf-navigation-drawer.component.scss']
})
export class LfNavigationDrawerComponent implements OnInit, OnDestroy {
  private _closeSubscription: Subscription;
  private _menuToggled = false;
  private _backgroundImage: SafeStyle;

  get menuToggled(): boolean {
    return this._menuToggled;
  }

  @ContentChildren(LfNavigationDrawerMenuDirective) private _drawerMenu: QueryList<LfNavigationDrawerMenuDirective>;

  //checks if there is a [LfNavigationDrawerMenuDirective] as content
  get isMenuAvailable(): boolean {
    return this._drawerMenu.length > 0;
  }
  //checks if there is a background image for the toolbar
  get isBackgroundAvailable(): boolean {
    return !!this._backgroundImage;
  }
  //title set in the sidenav
  @Input('sidenavTitle') sidenavTitle: string;
  //icon name displayed before the title.
  @Input('icon') icon: string;
  //logo icon name displayed before the title.
  @Input('logo') logo: string;
  //primary, accent, or warn
  @Input('color') color: string;
  //background image of the toolbar
  @Input('backgroundUrl')
  set backgroundUrl(backgroundUrl: any) { //use type [SafeResourceUrl] when warnings clear
    if (backgroundUrl) {
      const sanitizedUrl: string = this._sanitize.sanitize(SecurityContext.RESOURCE_URL, backgroundUrl);
      this._backgroundImage = this._sanitize.sanitize(SecurityContext.STYLE, 'url(' + sanitizedUrl + ')');
    }
  }
  get backgroundImage(): SafeStyle {
    return this._backgroundImage;
  }
  //displayed as part of navigation drawer sublabel.
  //if email is not set, then name will be the toggle menu text.
  @Input('name') name: string;
  //displayed as part of navigation drawer sublabel in the toggle menu text.
  //if email and name are not set, the toggle menu is not rendered.
  @Input('email') email: string;

  constructor( @Inject(forwardRef(() => LfLayoutComponent)) private _layout: LfLayoutComponent,
    private _sanitize: DomSanitizer) { }

  ngOnInit() {
    this._closeSubscription = this._layout.sidenav.onClose.subscribe(() => {
      this._menuToggled = false;
    });
  }

  ngOnDestroy(): void {
    if (this._closeSubscription) {
      this._closeSubscription.unsubscribe();
      this._closeSubscription = undefined;
    }
  }

  toggleMenu(): void {
    if (this.isMenuAvailable) {
      this._menuToggled = !this._menuToggled;
    }
  }

  //proxy toggle method to access sidenav from outside (lf-layout template)
  public toggle(): Promise<any> {
    return this._layout.toggle();
  }

  //proxy open method to access sidenav from outside (lf-layout template)
  public open(): Promise<any> {
    return this._layout.open();
  }

  //proxy close method to access sidenav from outside (lf-layout template)
  public close(): Promise<any> {
    return this._layout.close();
  }
}
