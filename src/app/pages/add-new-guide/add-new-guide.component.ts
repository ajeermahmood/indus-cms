import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddImgDialog } from "app/components/add-img-dialog/add-img-dialog.component";
import { AuthService } from "app/services/auth.service";
import { DevelopersService } from "app/services/developers.service";
import { Locations } from "app/utils/locations";

import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-add-new-guide",
  templateUrl: "./add-new-guide.component.html",
  styleUrls: ["./add-new-guide.component.scss"],
})
export class AddNewGuideComponent implements OnInit {
  dev_name: any = "";
  dev_short_desc: any = "";
  dev_long_desc: any = "";

  uploading_progress: any = 0;
  uploading: boolean = false;
  saving: boolean = false;

  main_img: any = "assets/img/add-image.png";
  main_img_file: File;

  gallary_imgs_files: File[] = [];
  gallary_imgs: any[] = [];

  locations: any[] = [];

  locationClass: Locations = new Locations();
  tinyMceConfig: any;

  guide_long_desc: any = "";

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private developerService: DevelopersService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }

    this.locations = this.locationClass.all_locations;

    this.tinyMceConfig = {
      height: 500,
      // menubar: true,
      plugins: [
        "advlist",
        "autolink",
        "link",
        "image",
        "lists",
        "charmap",
        "preview",
        "anchor",
        "pagebreak",
        "searchreplace",
        "wordcount",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "emoticons",
        "template",
        "help",
      ],
      toolbar:
        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | " +
        "bullist numlist outdent indent | link image | print preview media fullscreen | " +
        "forecolor backcolor emoticons | help",
      // plugins: [
      //   "advlist autolink lists link image charmap print preview anchor",
      //   "searchreplace visualblocks code fullscreen",
      //   "insertdatetime media table paste code help wordcount",
      //   "tinycomments mentions codesample emoticons checklist mediaembed",
      //   "casechange export formatpainter pageembed permanentpen footnotes",
      //   "advtemplate advtable advcode editimage tableofcontents mergetags",
      //   "powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss textcolor",
      // ],
      // toolbar: `undo redo | blocks fontfamily fontsize | formatselect | bold italic backcolor forecolor underline strikethrough link |
      //           align checklist numlist bullist indent outdent | emoticons charmap |
      //           image media table mergetags | lineheight | tinycomments |
      //           removeformat`,
      menubar: "file edit view insert format tools table help",
      link_default_target: "_blank",
    };
  }

  ngOnInit() {}

  handleFileInputGallary(files: FileList) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      this.gallary_imgs_files.push(file);
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.gallary_imgs.push(event.target.result);
      };
    });
  }

  removeGallaryImg(index: any) {
    this.gallary_imgs_files.splice(index, 1);
    this.gallary_imgs.splice(index, 1);
  }

  editImg(img, type): void {
    const dialogRef = this.dialog.open(AddImgDialog, {
      width: "40rem",
      height: "34rem",
      data: img,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.main_img = result.img;
      this.main_img_file = result.file;
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "top",
      horizontalPosition: "center",
    });
  }

  save() {
    if (
      this.dev_name != "" &&
      this.dev_short_desc != "" &&
      this.dev_long_desc != ""
    ) {
      const random_id = uuid.v4();
      const formdata: FormData = new FormData();
      this.saving = true;
      // var data = {
      //   name: this.dev_name,
      //   short_desc: this.dev_short_desc,
      //   long_desc: this.dev_long_desc,
      //   logo: `${random_id}_logo.${
      //     this.logo_img_file.name.split(".")[
      //       this.logo_img_file.name.split(".").length - 1
      //     ]
      //   }`,
      //   main_img: `${random_id}_main.${
      //     this.main_img_file.name.split(".")[
      //       this.main_img_file.name.split(".").length - 1
      //     ]
      //   }`,
      //   about_img: `${random_id}_about.${
      //     this.about_img_file.name.split(".")[
      //       this.about_img_file.name.split(".").length - 1
      //     ]
      //   }`,
      // };

      // this.developerService
      //   .addNewDeveloper(data)
      //   .subscribe((res) => {
      //     console.log(res);
      //   })
      //   .add(() => {
      //     this.saving = false;
      //     this.openSnackBar("Developer successfully added!");
      //   });
      // formdata.append("logo_img", this.logo_img_file);
      // formdata.append("logo_img_name", `${random_id}_logo`);

      // formdata.append("main_img", this.main_img_file);
      // formdata.append("main_img_name", `${random_id}_main`);

      // formdata.append("about_img", this.about_img_file);
      // formdata.append("about_img_name", `${random_id}_about`);

      // formdata.append("type", "new");
      // this.uploading = true;
      // this.developerService
      //   .updateDeveloperImg(formdata)
      //   .pipe(
      //     map((event) => this.getEventMessage(event)),
      //     tap((message) => {
      //       if (message == "File is 100% uploaded.") {
      //         this.uploading = false;
      //         this.openSnackBar("Developer images successfully updated!");
      //         setTimeout(() => {
      //           this.router.navigate(["/developers"]);
      //         }, 500);
      //       }
      //     }),
      //     last()
      //   )
      //   .subscribe((v) => {});
    }
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file `;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        this.uploading_progress = percentDone;
        return `File is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        this.uploading = false;
        return `File was completely uploaded!`;

      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }
}
