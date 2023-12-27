import { Component, OnInit } from "@angular/core";
import { DashboardService } from "app/services/dashboard.service";
import * as Chartist from "chartist";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  blogs_count: any = 0;
  news_count: any = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getallStats().subscribe((data) => {
      this.blogs_count = data.blogs_count;
      this.news_count = data.news_count;
    });
  }
}
