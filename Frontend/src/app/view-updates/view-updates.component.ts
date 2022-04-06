import { Component, Input, OnInit } from '@angular/core';
import { UpdatesService } from '../updates/updates.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';

@Component({
  selector: 'app-view-updates',
  templateUrl: './view-updates.component.html',
  styleUrls: ['./view-updates.component.css']
})
export class ViewUpdatesComponent implements OnInit {
  @Input() UpdateData : any
  content: any;
  PreviewPopup: boolean = false;
  Editor:any={};
  Loader: boolean = false;

  constructor(private updateService: UpdatesService) {
    this.Editor = InlineEditor;
   }

  ngOnInit(): void {
    console.log(this.UpdateData,'updatedata')
  }

  onPreview() {
    this.Loader = true;
    this.updateService.GetUpdateContent(this.UpdateData).subscribe(data => {
      this.content = data;
      console.log(this.content,'content')
      this.PreviewPopup = true;
      this.Loader = false;
    })
  }

}
