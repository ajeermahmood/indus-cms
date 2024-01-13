import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class ImageOptimizeService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  optimizeImage(imageData: Blob, options: any): Observable<any> {
    const formData = new FormData();
    formData.append("image", imageData, "image.png");
    formData.append("options", JSON.stringify(options));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer" as "json",
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
