import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {
  @Input() DocumentData : any;
  DocumentViewPopup: boolean = false;
  ViewFile: any;

  constructor() { }

  ngOnInit(): void {
  }

  onViewFile(){
    this.DocumentViewPopup = true;
    this.ViewFile = this.DocumentData;
  }

}
