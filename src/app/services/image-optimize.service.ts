import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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
    formData.append("image", imageData, "image.webp");
    formData.append("options", JSON.stringify(options));

    const url = `${this.apiUrl}/optimize-image`;
    const req = new HttpRequest("POST", url, formData, {
      reportProgress: true,
      responseType: "arraybuffer",
    });
    return this.http.request(req);
  }
}
