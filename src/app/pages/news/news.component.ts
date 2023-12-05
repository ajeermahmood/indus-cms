import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NewsService } from "app/services/news.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
})
export class NewsComponent implements OnInit {
  displayedColumns: string[] = ["id", "title", "date"];

  allNews: MatTableDataSource<any>;
  allNewsCount: any;
  isLoading: boolean = true;
  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private newsService: NewsService,
    private router: Router
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {}

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  ngOnInit() {
    this.newsService
      .getallNews(10, 1, "")
      .subscribe((res) => {
        console.log(res);
        this.allNews = new MatTableDataSource(res.blogs);
        this.allNewsCount = res.count;
        setTimeout(() => {
          if (this.allNews != undefined) {
            // this.allNews.paginator = this.paginator;
            this.allNews.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  navigateToViewPage(news: any) {
    this.router.navigate(["/news-view"], {
      queryParams: { id: news.news_id },
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.newsService
      .getallNews(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        console.log(res);
        this.allNews = new MatTableDataSource(res.blogs);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
