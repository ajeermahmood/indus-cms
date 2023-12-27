import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { EditorModule } from "@tinymce/tinymce-angular";
import { AddNewBlogComponent } from "app/pages/add-new-blog/add-new-blog.component";
import { AddNewNewsComponent } from "app/pages/add-new-news/add-new-news.component";
import { BlogViewComponent } from "app/pages/blog-view/blog-view.component";
import { BlogsComponent } from "app/pages/blogs/blogs.component";
import { CautionDialog } from "app/pages/common/caution-dialog/caution-dialog.component";
import { NewsViewComponent } from "app/pages/news-view/news-view.component";
import { NewsComponent } from "app/pages/news/news.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { AdminLayoutRoutes } from "./admin-layout.routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    EditorModule,
    NgxSkeletonLoaderModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
  ],
  declarations: [
    DashboardComponent,
    BlogsComponent,
    BlogViewComponent,
    NewsComponent,
    NewsViewComponent,
    AddNewBlogComponent,
    AddNewNewsComponent,
    CautionDialog,
  ],
})
export class AdminLayoutModule {}
