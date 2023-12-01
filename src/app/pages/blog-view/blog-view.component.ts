import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BlogsService } from "app/services/blog.service";

@Component({
  selector: "app-blog-view",
  templateUrl: "./blog-view.component.html",
  styleUrls: ["./blog-view.component.scss"],
})
export class BlogViewComponent implements OnInit {
  blog_id: any;
  isLoading: boolean = true;
  blogData: any;
  tinyMceConfig: any;
  constructor(
    private readonly route: ActivatedRoute,
    private blogsService: BlogsService
  ) {
    this.route.queryParams.subscribe((res) => {
      this.blog_id = res.id;
    });

    this.tinyMceConfig = {
      height: 500,
      menubar: true,
      image_advtab: true,
      imagetools_toolbar: `
        rotateleft rotateright |
        flipv fliph | 
        editimage imageoptions`,
      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
        "tinycomments mentions codesample emoticons checklist mediaembed",
        "casechange export formatpainter pageembed permanentpen footnotes",
        "advtemplate advtable advcode editimage tableofcontents mergetags",
        "powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss textcolor",
      ],
      toolbar: `undo redo | blocks fontfamily fontsize | formatselect | bold italic backcolor forecolor underline strikethrough link | 
                align checklist numlist bullist indent outdent | emoticons charmap | 
                image media table mergetags | lineheight | tinycomments |
                removeformat`,
      link_default_target: "_blank",
    };
  }

  ngOnInit() {
    this.blogsService
      .getBlogDetails(this.blog_id)
      .subscribe((res) => {
        console.log(res);
        this.blogData = res;
      })
      .add(() => {
        this.isLoading = false;
      });
  }
}
