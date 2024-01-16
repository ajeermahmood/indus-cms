import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ImageOptimizeService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  optimizeImage(imageData: any, options: any): Observable<any> {
    const url = `${this.apiUrl}/optimize-image`;
    const req = new HttpRequest(
      "POST",
      url,
      {
        imageData,
        options,
      },
      {
        reportProgress: true,
        responseType: "json",
      }
    );
    return this.http.request(req);
  }
}
