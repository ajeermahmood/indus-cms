import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog.component";
import { AuthService } from "app/services/auth.service";
import { NewLaunchesService } from "app/services/new-launches.service";

@Component({
  selector: "app-new-launches",
  templateUrl: "./new-launches.component.html",
  styleUrls: ["./new-launches.component.scss"],
})
export class NewLaunchesComponent implements OnInit {
  displayedColumns: string[] = ["id", "title", "date", "action"];

  allLaunches: MatTableDataSource<any>;
  allLaunchesCount: any;
  isLoading: boolean = true;
  pageChangeLoading: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private launchesService: NewLaunchesService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    if (!this.authService.currentUserValue) {
      this.router.navigate(["/login"]);
    }
  }

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
    this.launchesService
      .getallLaunches(10, 1, "")
      .subscribe((res) => {
        this.allLaunches = new MatTableDataSource(res.launches);
        this.allLaunchesCount = res.count;
        setTimeout(() => {
          if (this.allLaunches != undefined) {
            this.allLaunches.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  reloadPage() {
    this.isLoading = true;
    this.launchesService
      .getallLaunches(10, 1, "")
      .subscribe((res) => {
        this.allLaunches = new MatTableDataSource(res.launches);
        this.allLaunchesCount = res.count;
        setTimeout(() => {
          if (this.allLaunches != undefined) {
            this.allLaunches.sort = this.sort;
          }
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "close", {
      duration: 3000,
      // panelClass: "my-custom-snackbar",
      verticalPosition: "top",
      horizontalPosition: "center",
    });
  }

  navigateToViewPage(launch: any) {
    this.router.navigate(["/new-launch-view"], {
      queryParams: { id: launch.launch_id },
    });
  }
  navigateToAddNewLaunchPage() {
    this.router.navigate(["/add-new-launch"]);
  }

  delete(launch) {
    const dialogRef = this.dialog.open(CautionDialog, {
      width: "40rem",
      height: "17rem",
      data: {
        id: launch.launch_id,
        title: launch.launch_title,
        type: "launch",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.delete == true) {
        this.launchesService
          .deleteLaunch(
            launch.launch_id,
            launch.launch_mainimage,
            launch.launch_thumbnail
          )
          .subscribe((res) => {
            this.openSnackBar("New Launch deleted successfully");
            this.reloadPage();
          });
      }
    });
  }

  pageChange(event) {
    this.pageChangeLoading = true;
    this.launchesService
      .getallLaunches(event.pageSize, event.pageIndex + 1, "")
      .subscribe((res) => {
        this.allLaunches = new MatTableDataSource(res.launches);
      })
      .add(() => {
        this.pageChangeLoading = false;
      });
  }
}
