import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Route, Router } from "@angular/router";
import { BlogsService } from "app/services/blog.service";

@Component({
  selector: "app-blogs",
  templateUrl: "./blogs.component.html",
  styleUrls: ["./blogs.component.scss"],
})
export class BlogsComponent implements OnInit {
  displayedColumns: string[] = ["id", "title", "date"];

  allBlogs: MatTableDataSource<any>;
  allBlogsCount: any;
  isLoading: boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private blogsService: BlogsService,
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
    this.blogsService
      .getallBlogs(10, 1, "")
      .subscribe((res) => {
        console.log(res);
        this.allBlogs = new MatTableDataSource(res.blogs);
        this.allBlogsCount = res.count;
        setTimeout(() => {
          if (this.allBlogs != undefined) {
            this.allBlogs.paginator = this.paginator;
            this.allBlogs.paginator.pageSize = 10;
            this.allBlogs.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  navigateToViewPage(blog: any) {
    this.router.navigate(["/blog-view"], {
      queryParams: { id: blog.blogs_id },
    });
  }
}
