import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "add_category_dialog",
  styleUrls: ["./add-img-dialog.component.scss"],
  templateUrl: "./add-img-dialog.component.html",
})
export class AddImgDialog implements OnInit {
  image: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddImgDialog>,
    private dialog?: MatDialog
  ) {
    this.image = data;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  handleFileInput(files: any) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.image = event.target.result;
    };
  }

  submit() {
    this.dialogRef.close({
      img: this.image,
    });
  }
}
