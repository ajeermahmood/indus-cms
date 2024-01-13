import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from "ngx-image-cropper";

import { MatSnackBar } from "@angular/material/snack-bar";
import { ImageOptimizeService } from "app/services/image-optimize.service";
import { Observable, bindCallback, map, of, tap } from "rxjs";

@Component({
  selector: "app-optimize-img",
  templateUrl: "./optimize-img.component.html",
  styleUrls: ["./optimize-img.component.scss"],
})
export class OptimizeImgComponent implements OnInit {
  img: any;
  imgSelected: boolean = false;

  selected_img_file: File;

  maintainAspectRatio: boolean = false;

  lockAspectRatio: boolean = true;

  aspectRatio: any = 4 / 3;

  imageChangedEvent: any = "";
  croppedImage: any = "";
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  resize_width: number = 0;
  resize_height: number = 0;
  resize_scale: number = 100;

  img_quality: number = 80;
  img_format: any;

  img_file_name: any = "";

  fileSize: any = "200 KB";

  img_og_width: number;
  img_og_height: number;

  cropper: any = {};

  cropper_ready: boolean = false;
  image_processing: boolean = false;

  constructor(
    private imgService: ImageOptimizeService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

  aspectRatios: any[] = [
    { value: "free-form", viewValue: "Free-form" },
    { value: 4 / 4, viewValue: "Square" },
    { value: 3 / 2, viewValue: "3:2" },
    { value: 4 / 3, viewValue: "4:3" },
    { value: 16 / 9, viewValue: "16:9" },
  ];

  imgFormats: any[] = [
    { value: "png", viewValue: "PNG - Portable Network Graphics" },
    { value: "jpg", viewValue: "JPG - JPEG Image" },
    { value: "webp", viewValue: "WEBP - WebP Image" },
    { value: "avif", viewValue: "AVIF - AV1 Image File Format" },
    { value: "tiff", viewValue: "TIFF - Tagged Image File Format" },
  ];

  aspectRatioChange(event: any) {
    if (event.value == "free-form") {
      this.maintainAspectRatio = false;
    } else {
      this.maintainAspectRatio = true;
      this.aspectRatio = event.value;
    }
  }

  @HostListener("paste", ["$event"])
  onPaste(e: ClipboardEvent) {
    if (
      e.clipboardData.files.length != 0 &&
      e.clipboardData.files[0].type.startsWith("image")
    ) {
      this.selected_img_file = e.clipboardData.files[0];
      this.img_file_name = e.clipboardData.files[0].name.split(".")[0];
      this.imgSelected = true;
    }
  }

  ////////////////////////////////

  onDropFile(event) {
    if (event.addedFiles != undefined) {
      this.selected_img_file = event.addedFiles[0];
      this.img_file_name = event.addedFiles[0].name.split(".")[0];
      this.imgSelected = true;
    }
  }
  ////////////////////////////////

  ngOnInit() {}

  ngAfterViewInit() {}

  resizeImage() {
    this.resize_width = Math.round(
      this.img_og_width * (this.resize_scale / 100)
    );
    this.resize_height = Math.round(
      Math.min((this.resize_width * this.img_og_height) / this.img_og_width)
    );
  }

  clickResizeDimention(type) {
    if (this.lockAspectRatio) {
      if (type == "w") {
        this.resize_height = Math.round(
          Math.min((this.resize_width * this.img_og_height) / this.img_og_width)
        );

        var perc = (100 * this.resize_width) / this.img_og_width;
        this.resize_scale = Number(perc.toFixed(2));
      } else if (type == "h") {
        this.resize_width = Math.round(
          Math.min(
            (this.resize_height * this.img_og_width) / this.img_og_height
          )
        );

        var perc = (100 * this.resize_width) / this.img_og_width;
        this.resize_scale = Number(perc.toFixed(2));
      }
    } else {
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "bottom",
      horizontalPosition: "center",
    });
  }

  async download() {
    if (this.imgSelected) {
      if (this.img_format != undefined) {
        this.cropper_ready = false;
        this.image_processing = true;
        const options = {
          width: this.resize_width,
          height: this.resize_height,
          quality: this.img_quality,
          format: this.img_format,
        };

        this.imgService.optimizeImage(this.croppedImage, options).subscribe(
          (response: ArrayBuffer) => {
            this.downloadImage(response);
          },
          (error) => {
            console.error("Error optimizing image:", error);
          }
        );
      } else {
        this.openSnackBar("Please select image format!");
      }
    } else {
      this.openSnackBar("Please upload image!");
    }
  }

  downloadImage(buffer: ArrayBuffer) {
    // Assume you have called optimizeImage and obtained the ArrayBuffer
    const optimizedImageArrayBuffer: ArrayBuffer = buffer;

    // Create a Blob from the ArrayBuffer
    const blob = new Blob([optimizedImageArrayBuffer], {
      type: "application/octet-stream",
    });

    // Create a download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${this.img_file_name}.${this.img_format}`;

    // Append the link to the body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
    this.cropper_ready = true;
    this.image_processing = false;
  }

  fileChangeEvent(event: any): void {
    if (event.target.files.length > 0) {
      this.cropper_ready = false;
      this.imageChangedEvent = event;
      this.imgSelected = true;
      this.resize_scale = 100;

      this.img_file_name = event.target.files[0].name.split(".")[0];

      this.selected_img_file = event.target.files[0];
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
    this.resize_width = event.imagePosition.x2 - event.imagePosition.x1;
    this.resize_height = event.imagePosition.y2 - event.imagePosition.y1;
  }
  imageLoaded(event) {
    this.showCropper = true;
    this.img_og_width = event.transformed.size.width;
    this.img_og_height = event.transformed.size.height;
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    // cropper ready
    console.log("Cropper ready", sourceImageDimensions);
    this.cropper_ready = true;
  }
  loadImageFailed() {
    // show message
    console.log("Load failed");
  }

  clear() {
    location.reload();
  }

  rotateLeft() {
    this.cropper_ready = false;
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.cropper_ready = false;
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
    this.resize_scale = 100;
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }
}
