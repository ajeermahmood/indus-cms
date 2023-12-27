import { Routes } from "@angular/router";

import { AddNewBlogComponent } from "app/pages/add-new-blog/add-new-blog.component";
import { AddNewNewsComponent } from "app/pages/add-new-news/add-new-news.component";
import { BlogViewComponent } from "app/pages/blog-view/blog-view.component";
import { BlogsComponent } from "app/pages/blogs/blogs.component";
import { NewsViewComponent } from "app/pages/news-view/news-view.component";
import { NewsComponent } from "app/pages/news/news.component";
import { DashboardComponent } from "../../dashboard/dashboard.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "blogs", component: BlogsComponent },
  { path: "blog-view", component: BlogViewComponent },
  { path: "add-new-blog", component: AddNewBlogComponent },
  { path: "news", component: NewsComponent },
  { path: "news-view", component: NewsViewComponent },
  { path: "add-new-news", component: AddNewNewsComponent },
];
