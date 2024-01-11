import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import { DashboardService } from "app/services/dashboard.service";
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
  LoadedImage,
} from "ngx-image-cropper";
import { DomSanitizer } from "@angular/platform-browser";

import * as sharp from "sharp";

@Component({
  selector: "app-optimize-img",
  templateUrl: "./optimize-img.component.html",
  styleUrls: ["./optimize-img.component.scss"],
})
export class OptimizeImgComponent implements OnInit {
  img: any;
  imgSelected: boolean = false;

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

  img_quality: number = 100;
  img_format: any;

  img_file_name: any = "";

  fileSize: any = "200 KB";

  img_og_width: number;
  img_og_height: number;

  cropper: any = {};

  cropper_ready: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
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
    { value: "heic", viewValue: "HEIC - High-Efficiency Image Container" },
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

  async download() {
    console.log("download");
    console.log(this.croppedImage);

    // await sharp(this.croppedImage)
    //   .resize(this.resize_width, this.resize_height)
    //   .jpeg({ quality: this.img_quality })
    //   .toBuffer()
    //   .then((img) => {
    //     console.log(img);
    //   });
  }

  fileChangeEvent(event: any): void {
    this.cropper_ready = false;
    this.imageChangedEvent = event;
    this.imgSelected = true;
    this.resize_scale = 100;

    this.img_file_name = event.target.files[0].name;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
    this.resize_width = event.imagePosition.x2 - event.imagePosition.x1;
    this.resize_height = event.imagePosition.y2 - event.imagePosition.y1;
  }
  imageLoaded() {
    this.showCropper = true;
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    // cropper ready
    console.log("Cropper ready", sourceImageDimensions);

    setTimeout(() => {
      this.img_og_width = this.resize_width;
      this.img_og_height = this.resize_height;

      this.cropper_ready = true;
    }, 1000);
  }
  loadImageFailed() {
    // show message
    console.log("Load failed");
  }

  clear() {
    this.croppedImage = "";
    this.imageChangedEvent = "";
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
