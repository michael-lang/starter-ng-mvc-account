import { Component, ViewChild } from '@angular/core';
import { MdSidenav, MdSidenavToggleResult } from '@angular/material';

@Component({
  selector: 'lf-layout',
  templateUrl: './lf-layout.component.html',
  styleUrls: ['./lf-layout.component.scss']
})
export class LfLayoutComponent {
  @ViewChild(MdSidenav) sidenav: MdSidenav;

  public toggle(): Promise<MdSidenavToggleResult> {
    return this.sidenav.toggle();
  }
  public open(): Promise<MdSidenavToggleResult> {
    return this.sidenav.open();
  }
  public close(): Promise<MdSidenavToggleResult> {
    return this.sidenav.close();
  }
}
