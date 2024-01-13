import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class ImageOptimizeService {
  private apiUrl = "https://ireproperty.com";

  constructor(private http: HttpClient) {}

  uploadedPercentage: number = 0;
  downloadedPercentage: number = 0;

  optimizeImage(imageData: Blob, options: any): Observable<any> {
    const formData = new FormData();
    formData.append("image", imageData, "image.png");
    formData.append("options", JSON.stringify(options));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer" as "json",
      onDownloadProgress: (event) => {
        // console.log(event.event.target.response.length);
        // event.srcElement.getResponseHeader("content-length");
      },
      onUploadProgress: (e) => {
        // console.log("upload", e);
        this.uploadedPercentage = e.total
          ? Math.round((100 * e.loaded) / e.total)
          : 0;
      },
    };

    return new Observable((observer) => {
      axios
        .post(`${this.apiUrl}/optimize-image`, formData, config)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
