import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestService } from '../invest/invest.service';
import { InvestmentService } from '../investment/investment.service';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { UpdatesService } from '../updates/updates.service';

@Component({
  selector: 'app-myinvestment',
  templateUrl: './myinvestment.component.html',
  styleUrls: ['./myinvestment.component.css']
})
export class MyinvestmentComponent implements OnInit {
  @ViewChild(AddProfileComponent) addProfileComponent : any;
  @ViewChild(AddProfileComponent) ProfileValueData: any = [];
  Profile : any;
  Editor: any = {};
  Ckbool: boolean = true;
  UserId: any;
  Selected: any;
  ActiveInvestor: any = [];
  PastInvestor: any = [];
  PendingInvestor: any = [];
  ReservationInvestor: any = [];
  ActiveShow: boolean = false;
  PendingShow: boolean = false;
  PastShow: boolean = false;
  ResShow: boolean = false;
  ActiveCount: any;
  PendingCount: any;
  PastCount: any;
  ReserveCount: any;
  InvestAmount: any = 0;
  ViewDetails: boolean = false;
  summaryBool: boolean = false;
  documentBool: boolean = false;
  locationBool: boolean = false;
  ViewDetailsDataValue: any;
  ViewDetailsSummaryValue: any = [];
  ViewDetailsDocValue: any = [];
  ViewDetailsLocationValue: any = [];
  ViewDetailsUpdateValue: any = [];
  Activeofferingtab: boolean = false;
  Reservationtab: boolean = false;
  Pastofferingtab: boolean = false;
  updatenBool: boolean = false;
  EditReservationPopup: boolean = false;
  InvestingProfile: any = 0;
  InvestError: boolean = false;
  InsAmtError: boolean = false;
  MinimumError: boolean = false;
  InvestmentAmount: any = '';
  MinInvestment: any = 0;
  ProfileValue: any = [];
  profile: any;
  ProfileId: any = 0;
  UserData: any;
  AddEditData: any;
  ReservationData: any = [];
  ExistProfileShow: boolean = false;
  ExistProfileHide: boolean = false;
  ReservationId: any = 0;
  ReservationActive: boolean = true;
  Loader: boolean = false
  HeaderData: any;
  InvestmentData: any = [];
  Markers: any = [];
  lat : any;
  lng : any;
  zoom : any;
  AccountStatementDataValue : any;
  ViewUpdatePopup : boolean = false;
  UpdateValue: any = [];


  constructor(private investmentService: InvestmentService,
    private router: Router,
    private profileService: InvestorProfileService,
    private investService: InvestService,
    private updateService : UpdatesService,
    private toastr: ToastrService,
    private formbuilder: FormBuilder,
    private route: ActivatedRoute) {
    this.Editor = InlineEditor;
    this.lat = 0;
    this.lng = 0;
    this.zoom = 2;
    this.Markers = [];
  }

  ngOnInit(): void {
    this.Loader = true;
    if(window.name==='Remote'){
      this.UserId=localStorage.getItem('InvestorId');
    }else{
      this.UserId = localStorage.getItem('UserId');
    }
    this.AccountStatementDataValue = {
      InvestorId: this.UserId,
    }
    this.Selected = 'ActiveInvestment';
    this.ActiveShow = true;
    this.GetHeaderData();
    this.GetInvestmentByUserId();
    this.GetProfile();
    this.GetUserById();
  }
  // mapOptions: google.maps.MapOptions = {
  //   center: this.coordinates,
  //   zoom: 8
  // };
  // marker = new google.maps.Marker({
  //   position: this.coordinates,
  //   // map: this.map,
  // });
  // ngAfterViewInit() {
  //   this.mapInitializer();
  // }
  // mapInitializer() {
  //   this.map = new google.maps.Map(this.gmap.nativeElement,
  //     this.mapOptions);
  //   this.marker.setMap(this.map);
  // }

  GetInvestmentByUserId() {
    this.investmentService.GetInvestmentByUser(this.UserId).subscribe(data => {
      this.InvestmentData = data;
      this.ActiveInvestor = this.InvestmentData.filter((x: { status: number; }) => x.status == 1);
      this.PendingInvestor = this.InvestmentData.filter((x: { status: number; }) => x.status == 3);
      this.PastInvestor = this.InvestmentData.filter((x: { status: number; }) => x.status == 0);
      this.ReservationInvestor = this.InvestmentData.filter((x: { isReservation: boolean; }) => x.isReservation == true);
      this.ActiveCount = this.ActiveInvestor.length;
      this.PendingCount = this.PendingInvestor.length;
      this.PastCount = this.PastInvestor.length;
      this.ReserveCount = this.ReservationInvestor.length;
      if (this.ActiveInvestor.length != 0) {
        for (let i = 0; i < this.ActiveInvestor.length; i++) {
          this.InvestAmount = this.InvestAmount + this.ActiveInvestor[i].amount;
        }
      }
      this.Loader = false;
    })
  }
  ActiveInvest() {
    this.Selected = 'ActiveInvestment';
    this.ActiveShow = true;
    this.PendingShow = false;
    this.PastShow = false;
    this.ResShow = false;
  }
  PendingInvest() {
    this.Selected = 'PendingInvestment';
    this.ActiveShow = false;
    this.PendingShow = true;
    this.PastShow = false;
    this.ResShow = false;
  }
  PastInvest() {
    this.Selected = 'PastInvestment';
    this.ActiveShow = false;
    this.PendingShow = false;
    this.PastShow = true;
    this.ResShow = false;
  }
  Reservation() {
    this.Selected = 'Reservation';
    this.ActiveShow = false;
    this.PendingShow = false;
    this.PastShow = false;
    this.ResShow = true;
  }
  onFundingInstruction(val: any) {
    this.router.navigate(['./../investment/' + val.offeringId + '/' + val.id + '/fund'], { relativeTo: this.route });
  }
  onCompleteEsign(val: any) {
    this.router.navigate(['./../investment/' + val.offeringId + '/' + val.id + '/esign'], { relativeTo: this.route });
  }
  // onViewDetails(value: any) {
  //   this.ViewDetails = true;
  //   this.ViewDetailsDataValue = value;
  //   this.ViewDetailsSummaryValue = [];
  //   this.ViewDetailsDocValue = [];
  //   this.ViewDetailsLocationValue = [];
  //   this.ViewDetailsUpdateValue = []
  //   this.ViewDetailsSummaryValue = value.summary;
  //   this.ViewDetailsDocValue = value.documents;
  //   this.ViewDetailsLocationValue = value.locations;
  //   this.ViewDetailsUpdateValue = value.updates
  //   this.Selected = 'Summary';
  //   this.summaryBool = true;
  //   this.Markers.push({
  //     position: {
  //       lat: this.ViewDetailsLocationValue[0].latitude,
  //       lng:this.ViewDetailsLocationValue[0].longitude
  //     },
  //     // label: {
  //     //   color: 'black',
  //     //   text: 'Madrid',
  //     // },
  //   });
  // }
  onViewAvalibleOfferings() {
    this.router.navigate(['./invest'])
  }
  selectSummary() {
    this.Selected = 'Summary';
    this.summaryBool = true;
    this.documentBool = false;
    this.locationBool = false;
    this.updatenBool = false;
  }
  selectDocument() {
    this.Selected = 'Documents';
    this.summaryBool = false;
    this.documentBool = true;
    this.locationBool = false;
    this.updatenBool = false;
  }
  selectLocation() {
    this.Selected = 'Location';
    this.summaryBool = false;
    this.documentBool = false;
    this.locationBool = true;
    this.updatenBool = false;
  }
  selectUpdate() {
    this.Selected = 'Update';
    this.summaryBool = false;
    this.documentBool = false;
    this.locationBool = false;
    this.updatenBool = true;
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
  onEditReservation(val: any) {
    this.EditReservationPopup = true;
    this.InsAmtError = false;
    this.MinimumError = false;
    this.InvestError = false;
    this.AddEditData = val;
    this.InvestingProfile = +this.AddEditData.userProfileId
    this.InvestmentAmount = +this.AddEditData.amount
    this.ReservationId = +this.AddEditData.id
  }
  onChooseProfileChange(e: any) {
    this.InvestingProfile = +e.target.value;
    if (e.target.value == 0) {
      this.InvestError = true;
    }
    else {
      this.InvestError = false;
    }
    let x = this.ReservationData.filter((x: { userProfileId: any; }) => x.userProfileId == this.InvestingProfile)
    if (x.length != 0) {
      this.ReservationId = x[0].id
      this.InvestmentAmount = x[0].amount
    }
    else {
      this.InvestmentAmount = ''
    }
  }
  GetProfile() {
    this.profileService.GetProfileById(this.UserId).subscribe(data => {
      let x: any = data;
      this.ProfileValue = [];
      this.ProfileValue.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        if (x[i].name != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
        else if (x[i].firstName != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].firstName, active: x[i].active })
        }
        else if (x[i].trustName != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].trustName, active: x[i].active })
        }
        else if (x[i].retirementPlanName != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].retirementPlanName, active: x[i].active })
        }
      }
    })
  }
  onInsAmt(e: any) {
    let x = this.AddEditData.keyHighlights.filter((x: { name: string; }) => x.name == 'Reservation Size')
    let y = x[0].value
    this.InvestmentAmount = e.target.value
    if (this.InvestmentAmount == null || this.InvestmentAmount == '') {
      this.InsAmtError = true;
      this.MinimumError = false;
    }
    else if (+this.InvestmentAmount > +y) {
      this.MinimumError = true;
      this.InsAmtError = false;
    }
    else {
      this.InsAmtError = false;
      this.MinimumError = false;
    }
  }
  onReserve(val: any) {
    if (val == "withdraw") {
      this.ReservationActive = false
    }
    else {
      this.ReservationActive = true;
    }
    if (this.InvestingProfile == 0 || this.InvestmentAmount == null) {
      if (this.InvestingProfile == 0) {
        this.InvestError = true;
      }
      else {
        this.InvestError = false;
      }
    }
    if (val != "withdraw") {
      if (this.InvestmentAmount == '' || +this.InvestmentAmount < +this.MinInvestment) {
        if (this.InvestmentAmount == null || this.InvestmentAmount == '') {
          this.InsAmtError = true;
          this.MinimumError = false;
        }
        else if (+this.InvestmentAmount < +this.MinInvestment) {
          this.MinimumError = true;
          this.InsAmtError = false;
        }
        else {
          this.InsAmtError = false;
          this.MinimumError = false;
        }
      }
    }
    if (this.InvestError == false && this.InsAmtError == false && this.MinimumError == false) {
      let reserve = {
        Id: this.ReservationId != 0 ? this.ReservationId : 0,
        UserId: +this.UserId,
        UserProfileId: this.InvestingProfile,
        OfferingId: this.AddEditData.id,
        Amount: this.InvestmentAmount == '' ? 0 : +this.InvestmentAmount,
        IsReservation: true,
        Status: 2,
        Active: this.ReservationActive
      }
      if (this.ReservationId != 0) {
        this.Loader = true;
        this.investService.UpdateReservation(reserve).subscribe(data => {
          let x: any = data
          if (x.statusCode == 1) {
            this.GetInvestmentByUserId();
            this.EditReservationPopup = false;
            this.toastr.success('Reservation updated successfully', 'Success!')
          }
        })
      }
    }
  }

  GetUserById() {
    this.profileService.GetUserById(this.UserId).subscribe(data => {
      this.UserData = data;
    })
  }
  GetReservationById() {
    this.investService.GetReservationById(this.UserId).subscribe(data => {
      this.ReservationData = data;
    })
  }
  GetHeaderData() {
    this.investService.GetHeaderDataByMyInvestment(this.UserId).subscribe(data => {
      this.HeaderData = data;
    })
  }
  GoogleMap(){
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
  receiveMessage(e : any) {
    this.ProfileValue = [];
    this.ProfileValue.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < e.length; i++) {
        if (e[i].name != null) {
          this.ProfileValue.push({ id: e[i].id, name: e[i].name, active: e[i].active })
        }
        else if (e[i].firstName != null) {
          this.ProfileValue.push({ id: e[i].id, name: e[i].firstName, active: e[i].active })
        }
        else if (e[i].trustName != null) {
          this.ProfileValue.push({ id: e[i].id, name: e[i].trustName, active: e[i].active })
        }
        else if (e[i].retirementPlanName != null) {
          this.ProfileValue.push({ id: e[i].id, name: e[i].retirementPlanName, active: e[i].active })
        }
      }
  }

  onViewUpdates(value : any){
    this.updateService.GetUpdates(this.UserId).subscribe(data => {
      if (data) {
        this.UpdateValue = data;
        this.UpdateValue = this.UpdateValue.filter((x: { name: any; }) =>x.name == value.offeringName);
        if(this.UpdateValue.length > 0){
          this.ViewUpdatePopup = true;
        }
        else{
          this.ViewUpdatePopup = false;
          this.toastr.info('Current offering doesnot have updates', 'Info!')
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })

  }
}
