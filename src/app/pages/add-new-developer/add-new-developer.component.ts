import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddImgDialog } from "app/components/add-img-dialog/add-img-dialog.component";
import { AuthService } from "app/services/auth.service";
import { DevelopersService } from "app/services/developers.service";

import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "app-add-new-developer",
  templateUrl: "./add-new-developer.component.html",
  styleUrls: ["./add-new-developer.component.scss"],
})
export class AddNewDeveloperComponent implements OnInit {
  dev_name: any = "";
  dev_short_desc: any = "";
  dev_long_desc: any = "";

  uploading_progress: any = 0;
  uploading: boolean = false;
  saving: boolean = false;

  logo_img: any = "assets/img/add-image.png";
  logo_img_file: File;

  main_img: any = "assets/img/add-image.png";
  main_img_file: File;

  about_img: any = "assets/img/add-image.png";
  about_img_file: File;

  tinyMceConfig: any;

  properties_by_name: any;
  properties_by_link: any;

  communities_by_name: any;
  communities_by_link: any;

  ready_to_move_by_name: any;
  ready_to_move_by_link: any;

  properties_by: any[] = [];
  communities_by: any[] = [];
  ready_to_move_by: any[] = [];

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

  addProps(type) {
    if (type == "prop") {
      this.properties_by.push({
        name: this.properties_by_name,
        link: this.properties_by_link,
      });

      this.properties_by_name = "";
      this.properties_by_link = "";
    } else if (type == "comm") {
      this.communities_by.push({
        name: this.communities_by_name,
        link: this.communities_by_link,
      });

      this.communities_by_name = "";
      this.communities_by_link = "";
    } else if (type == "ready") {
      this.ready_to_move_by.push({
        name: this.ready_to_move_by_name,
        link: this.ready_to_move_by_link,
      });

      this.ready_to_move_by_name = "";
      this.ready_to_move_by_link = "";
    }
  }

  removeProps(type, index) {
    if (type == "prop") {
      this.properties_by.splice(index, 1);
    } else if (type == "comm") {
      this.communities_by.splice(index, 1);
    } else if (type == "ready") {
      this.ready_to_move_by.splice(index, 1);
    }
  }

  ngOnInit() {}

  handleFileInput(files: any) {
    this.logo_img_file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.logo_img = event.target.result;
    };
  }

  editImg(img, type): void {
    const dialogRef = this.dialog.open(AddImgDialog, {
      width: "40rem",
      height: "34rem",
      data: img,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (type == "main") {
        this.main_img = result.img;
        this.main_img_file = result.file;
      } else {
        this.about_img = result.img;
        this.about_img_file = result.file;
      }
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
      this.dev_long_desc != "" &&
      this.logo_img != "assets/img/add-image.png" &&
      this.main_img != "assets/img/add-image.png" &&
      this.about_img != "assets/img/add-image.png"
    ) {
      const random_id = uuid.v4();
      const formdata: FormData = new FormData();
      this.saving = true;
      var data = {
        name: this.dev_name,
        short_desc: this.dev_short_desc,
        long_desc: this.dev_long_desc,
        logo: `${random_id}_logo.${
          this.logo_img_file.name.split(".")[
            this.logo_img_file.name.split(".").length - 1
          ]
        }`,
        main_img: `${random_id}_main.${
          this.main_img_file.name.split(".")[
            this.main_img_file.name.split(".").length - 1
          ]
        }`,
        about_img: `${random_id}_about.${
          this.about_img_file.name.split(".")[
            this.about_img_file.name.split(".").length - 1
          ]
        }`,

        properties_by: JSON.stringify(this.properties_by),
        communities_by: JSON.stringify(this.communities_by),
        ready_to_move_by: JSON.stringify(this.ready_to_move_by),
      };

      this.developerService
        .addNewDeveloper(data)
        .subscribe((res) => {
          console.log(res);
        })
        .add(() => {
          this.saving = false;
          this.openSnackBar("Developer successfully added!");
        });
      formdata.append("logo_img", this.logo_img_file);
      formdata.append("logo_img_name", `${random_id}_logo`);

      formdata.append("main_img", this.main_img_file);
      formdata.append("main_img_name", `${random_id}_main`);

      formdata.append("about_img", this.about_img_file);
      formdata.append("about_img_name", `${random_id}_about`);

      formdata.append("type", "new");
      this.uploading = true;
      this.developerService
        .updateDeveloperImg(formdata)
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message) => {
            if (message == "File is 100% uploaded.") {
              this.uploading = false;
              this.openSnackBar("Developer images successfully updated!");
              setTimeout(() => {
                this.router.navigate(["/developers"]);
              }, 500);
            }
          }),
          last()
        )
        .subscribe((v) => {});
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
