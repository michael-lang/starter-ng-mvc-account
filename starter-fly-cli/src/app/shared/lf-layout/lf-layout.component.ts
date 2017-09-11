import { Component, ViewChild } from '@angular/core';
import { MdSidenav } from '@angular/material';

@Component({
  selector: 'lf-layout',
  templateUrl: './lf-layout.component.html',
  styleUrls: ['./lf-layout.component.scss']
})
export class LfLayoutComponent {
  @ViewChild(MdSidenav) sidenav: MdSidenav;

  public toggle(): Promise<any> {
    return this.sidenav.toggle();
  }
  public open(): Promise<any> {
    return this.sidenav.open();
  }
  public close(): Promise<any> {
    return this.sidenav.close();
  }
}
