import { NgModule } from '@angular/core';

import {
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdCoreModule,
    MdDatepickerModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdToolbarModule,
} from '@angular/material';

export const APP_SHARED_MATERIAL_MODULES = [
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdCoreModule,
    MdDatepickerModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdToolbarModule,
];

@NgModule({
    imports: [
        ...APP_SHARED_MATERIAL_MODULES
    ],
    exports: [
        ...APP_SHARED_MATERIAL_MODULES
    ],
    declarations: []
})
export class SharedImportsModule { }
