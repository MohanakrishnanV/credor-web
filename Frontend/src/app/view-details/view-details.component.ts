import { Component, Input, OnInit } from '@angular/core';
import { InvestService } from '../invest/invest.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
  @Input() ViewDetailData: any;
  Loader: boolean = false;
  ViewDetails: boolean = false;
  ViewDetailsButton: boolean = false;
  LinkViewDetails: boolean = false;
  isPrivate: boolean = false;
  Selected: any;
  summaryBool: boolean = false;
  documentBool: boolean = false;
  locationBool: boolean = false;
  ViewDetailsDataValue: any;
  ViewDetailsSummaryValue: any = [];
  ViewDetailsDocValue: any = [];
  ViewDetailsLocationValue: any = [];
  Markers: any = [];
  Editor: any = {};
  lat: any;
  lng: any;
  zoom: any;
  Activeofferingtab: boolean = false;
  Reservationtab: boolean = false;
  Pastofferingtab: boolean = false;
  InvestDisabled: boolean = false;
  UserId: any;
  RoleId: any;
  ProfileImg: any;
  rmode: boolean = false;
  Ckbool: boolean = true;
  Viewname: any;
  InvestPercentage: any;

  constructor(private investService: InvestService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) {
    this.Editor = InlineEditor;
    this.lat = 0;
    this.lng = 0;
    this.zoom = 2;
    this.Markers = [];
  }

  ngOnInit(): void {
    var offeringId = +this.route.snapshot.params['id'];
    var url = this.router.url;
    var viewdetails = url.split('/');
    var viewDetails = viewdetails[1];
    this.ViewDetailsButton = true;
    if (viewDetails === 'view-details') {
      if (offeringId) {
        this.onLinkActiveViewDetails(offeringId);
      }
    }
    if (window.name === 'Remote') {
      this.RoleId = 1;
      this.UserId = localStorage.getItem('InvestorId');
      this.ProfileImg = localStorage.getItem("I_profileurl");
      this.rmode = true;
    } else {
      this.RoleId = Number(localStorage.getItem("RoleId"));
      this.UserId = localStorage.getItem('UserId');
      this.ProfileImg = localStorage.getItem("ProfileImg");
      this.rmode = false;
    }
    if (this.RoleId == 1) {
      this.Viewname = 'View Details';
    }
    else if (this.RoleId == 3) {
      this.Viewname = 'Preview';
    }
  }
  onActiveViewDetails() {
    this.Loader = true;
    this.investService.GetOfferingId(this.ViewDetailData).subscribe(data => {
      this.Loader = false;
      this.ViewDetails = true;
      this.Selected = 'Summary';
      this.summaryBool = true;
      this.ViewDetailsDataValue = data;
      if (this.ViewDetailsDataValue.showPercentageRaised == true) {
        this.investService.GetPercentageRaised(this.ViewDetailData.id).subscribe(data => {
          this.InvestPercentage = data;
        })
      }
      this.ViewDetailsSummaryValue = [];
      this.ViewDetailsDocValue = [];
      this.ViewDetailsLocationValue = [];
      this.ViewDetailsSummaryValue = this.ViewDetailsDataValue.summary;
      this.ViewDetailsDocValue = this.ViewDetailsDataValue.documents;
      this.ViewDetailsLocationValue = this.ViewDetailsDataValue.locations;
      this.Markers.push({
        position: {
          lat: this.ViewDetailsLocationValue[0].latitude,
          lng: this.ViewDetailsLocationValue[0].longitude
        },
        // label: {
        //   color: 'black',
        //   text: 'Madrid',
        // },
      });
    })
  }

  onLinkActiveViewDetails(Id: any) {
    var id = Id;
    this.Loader = true;
    this.investService.GetOfferingId(id).subscribe(data => {
      this.Loader = false;
      this.ViewDetailsButton = false;
      this.Selected = 'Summary';
      this.summaryBool = true;
      this.ViewDetailsDataValue = data;
      var isPrivate = this.ViewDetailsDataValue.isPrivate;
      if (isPrivate) {
        this.LinkViewDetails = true;
        if (this.ViewDetailsDataValue.showPercentageRaised == true) {
          this.investService.GetPercentageRaised(id).subscribe(data => {
            this.InvestPercentage = data;
          })
        }
        var isDocumentPrivate = this.ViewDetailsDataValue.isDocumentPrivate;
        this.ViewDetailsSummaryValue = [];
        this.ViewDetailsDocValue = [];
        this.ViewDetailsLocationValue = [];
        this.ViewDetailsSummaryValue = this.ViewDetailsDataValue.summary;
        if (isDocumentPrivate) {
          this.ViewDetailsDocValue = this.ViewDetailsDataValue.documents;
        }
        this.ViewDetailsLocationValue = this.ViewDetailsDataValue.locations;
        this.Markers.push({
          position: {
            lat: this.ViewDetailsLocationValue[0].latitude,
            lng: this.ViewDetailsLocationValue[0].longitude
          },
        });
      }
      else {
        this.isPrivate = true;
      }
    })
  }
  Onexplore() {
    window.location.href = 'http://credor-app.azurewebsites.net/login';
  }
  OnRegister() {
    window.location.href = 'http://credor-app.azurewebsites.net/register';
  }
  GoogleMap() {
    this.Markers.push({
      position: {
        lat: 51.673858,
        lng: 7.815982,
      },
      label: {
        color: 'black',
        text: 'Madrid',
      },
    });
  }

  CloseViewDetails(val: any) {
    this.ViewDetails = false;
    if (val.active == true && val.isReservation == false) {
      this.selectActiveOffering();
    }
    else if (val.active == false && val.isReservation == false) {
      this.selectPastOffering();
    }
    else if (val.active == true && val.isReservation == true) {
      this.selectReservation();
    }
  }
  selectActiveOffering() {
    this.Selected = 'ActiveOffering';
    this.Activeofferingtab = true;
    this.Reservationtab = false;
    this.Pastofferingtab = false;
    this.ViewDetails = false;
  }
  selectReservation() {
    this.Selected = 'Reservation';
    this.Activeofferingtab = false;
    this.Reservationtab = true;
    this.Pastofferingtab = false;
    this.ViewDetails = false;
  }
  selectPastOffering() {
    this.Selected = 'PastOffering';
    this.Activeofferingtab = false;
    this.Reservationtab = false;
    this.Pastofferingtab = true;
    this.ViewDetails = false;
  }
  onInvestNow(invest: any) {
    if (this.UserId != null) {
      this.InvestDisabled = false;
      this.router.navigate(['./../investment/' + invest.id], { relativeTo: this.route });
    }
    else {
      this.InvestDisabled = true;
      this.toastr.info('Please "Sign in" to invest on the deals', 'Info!')
    }
  }
  selectSummary() {
    this.Selected = 'Summary';
    this.summaryBool = true;
    this.documentBool = false;
    this.locationBool = false;
  }
  selectDocument() {
    this.Selected = 'Documents';
    this.summaryBool = false;
    this.documentBool = true;
    this.locationBool = false;
  }
  selectLocation() {
    this.Selected = 'Location';
    this.summaryBool = false;
    this.documentBool = false;
    this.locationBool = true;
  }

  onDownloadFile(value: any) {
    var a = document.createElement('a');
    a.href = value.filePath;
    a.download = value.name;
    a.click();
  }
}
