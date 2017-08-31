import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdIconModule, MdToolbarModule, MdMenuModule, MdButtonModule } from '@angular/material';

import { LfLayoutNavComponent } from './lf-layout-nav/lf-layout-nav.component';
import { LfLayoutComponent } from './lf-layout/lf-layout.component';
import {
  LfNavigationDrawerMenuDirective,
  LfNavigationDrawerComponent
} from './lf-navigation-drawer/lf-navigation-drawer.component';
import { LfTitleComponent } from './lf-title/lf-title.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MdIconModule,
    MdToolbarModule,
    MdMenuModule,
    MdButtonModule,
  ],
  exports: [
    LfLayoutNavComponent,
    LfLayoutComponent,
    LfNavigationDrawerMenuDirective,
    LfNavigationDrawerComponent,
    LfTitleComponent,
  ],
  declarations: [
    LfLayoutNavComponent,
    LfLayoutComponent,
    LfNavigationDrawerMenuDirective,
    LfNavigationDrawerComponent,
    LfTitleComponent,
  ]
})
export class SharedModule { }
