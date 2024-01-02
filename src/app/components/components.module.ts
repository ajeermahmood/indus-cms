import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CautionDialog } from "./caution-dialog/caution-dialog.component";
import { AddImgDialog } from "./add-img-dialog/add-img-dialog.component";
import { MatIconModule } from "@angular/material/icon";
import { AddNewSliderImgDialog } from "./add-new-slider-img-dialog/add-new-slider-img-dialog.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditSliderImgDialog } from "./edit-slider-img-dialog/edit-slider-img-dialog.component";
import { AddNewAdBannerDialog } from "./add-new-ad-banner-dialog/add-new-ad-banner-dialog.component";
import { EditAdBannerDialog } from "./edit-ad-banner-dialog/edit-ad-banner-dialog.component";
import { AddNewVideoDialog } from "./add-new-video-dialog/add-new-video-dialog.component";
import { EditVideoDialog } from "./edit-video-dialog/edit-video-dialog.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CautionDialog,
    AddImgDialog,
    AddNewSliderImgDialog,
    EditSliderImgDialog,
    AddNewAdBannerDialog,
    EditAdBannerDialog,
    AddNewVideoDialog,
    EditVideoDialog,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CautionDialog,
    AddImgDialog,
    AddNewSliderImgDialog,
    EditSliderImgDialog,
    AddNewAdBannerDialog,
    EditAdBannerDialog,
    AddNewVideoDialog,
    EditVideoDialog,
  ],
})
export class ComponentsModule {}
