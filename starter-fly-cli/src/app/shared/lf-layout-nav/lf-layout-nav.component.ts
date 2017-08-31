import { Component, Input, forwardRef, Optional, Inject } from '@angular/core';
import { LfLayoutComponent } from '../lf-layout/lf-layout.component';

@Component({
  selector: 'lf-layout-nav',
  templateUrl: './lf-layout-nav.component.html',
  styleUrls: ['./lf-layout-nav.component.scss']
})
export class LfLayoutNavComponent {
  @Input('toolbarTitle') toolbarTitle: string;
  @Input('icon') icon: string;
  @Input('logo') logo: string; //only icon or logo is displayed

  constructor(@Optional() @Inject(forwardRef( () => LfLayoutComponent)) private _layout: LfLayoutComponent) { }

  get isMainSidnavAvailable(): boolean {
    return !!this._layout;
  }

  openMainSidenav(): void {
    this._layout.open();
  }
}
