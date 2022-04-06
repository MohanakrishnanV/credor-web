import { trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestService } from './invest.service';
import SwiperCore, { Pagination, Navigation } from "swiper";
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment.prod';
import { AddProfileComponent } from '../add-profile/add-profile.component';

SwiperCore.use([Pagination, Navigation]);
@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {
  @ViewChild(AddProfileComponent) addProfileComponent: any;
  @ViewChild(AddProfileComponent) ProfileValueData: any = [];
  Profile: any;
  Editor: any = {};
  Activeoffering: any = [];
  Selected: any;
  Activeofferingtab: boolean = false;
  Reservationtab: boolean = false;
  Pastofferingtab: boolean = false;
  Reservation: any = [];
  Pastoffering: any = [];
  Marketplace: any = [];
  actCount: any;
  resCount: any;
  PastCount: any;
  UserId: any;
  InvestDisabled: boolean = false;
  profileDropdown: boolean = false;
  AddEditReservationPopup: boolean = false;
  InvestingProfile: any = 0;
  ProfileValue: any = [];
  InvestError: boolean = false;
  InsAmtError: boolean = false;
  MinimumError: boolean = false;
  InvestmentAmount: any = '';
  MinInvestment: any = 0;
  UserData: any;
  AddEditData: any;
  ReservationData: any = [];
  ExistProfileShow: boolean = false;
  ExistProfileHide: boolean = false;
  ReservationId: any = 0;
  ReservationActive: boolean = true;
  Loader: boolean = false
  NotificationData: any = [];
  Notification: any = [];
  thisUser: any;
  NotificationDropdown: boolean = false;
  Markers: any = [];
  lat: any;
  lng: any;
  zoom: any;
  ProfileImg: any;
  RoleId: any;
  rmode: boolean = false;

  constructor(private investService: InvestService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formbuilder: FormBuilder,
    private profileService: InvestorProfileService,
    private accountService: AccountService,
    private router: Router) {
    this.Editor = InlineEditor;
    this.lat = 0;
    this.lng = 0;
    this.zoom = 2;
    this.Markers = [];
  }

  ngOnInit(): void {
    this.Loader = true;
    //this.UserId = localStorage.getItem('UserId');
    // this.ProfileImg = localStorage.getItem("ProfileImg");
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
    this.GetMarketplace();
    this.Selected = 'ActiveOffering';
    this.Activeofferingtab = true;
    this.GetProfile();
    this.GetUserById();
    this.GetNotification();


    const connection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.NOTIFICATION_URL + "/notificationHub")
      .build();

    connection.start().then(function () {
      console.log('Connected!');
    }).catch(function (err) {
      return console.error(err);
    });
    connection.onclose(() => {
      setTimeout(function () {
        connection.start().then(function () {
          console.log('Reconnected!');
        }).catch(function (err) {
          console.error(err)
        });
      }, 3000);
    });
    connection.on("ForceLogout", (data: any) => {
      console.clear();
    });
    connection.on("Push_Notification", (data: any) => {
      this.thisUser = [];
      let UserId = Number(localStorage.getItem('UserId'));
      if (data.userId == UserId) {
        this.NotificationData.unshift(data);
      }
    });
  }

  GetMarketplace() {
    this.investService.GetMarketplace().subscribe(data => {
      this.Marketplace = data
      this.Activeoffering = this.Marketplace.filter((x: { active: boolean; isReservation: boolean }) => x.active == true && x.isReservation == false);
      this.Reservation = this.Marketplace.filter((x: { isReservation: boolean }) => x.isReservation == true);
      this.Pastoffering = this.Marketplace.filter((x: { active: boolean; isReservation: boolean }) => x.active == false && x.isReservation == false);
      this.actCount = this.Activeoffering.length
      this.resCount = this.Reservation.length
      this.PastCount = this.Pastoffering.length
      this.Loader = false;
    });
  }

  selectActiveOffering() {
    this.Selected = 'ActiveOffering';
    this.Activeofferingtab = true;
    this.Reservationtab = false;
    this.Pastofferingtab = false;
  }
  selectReservation() {
    this.Selected = 'Reservation';
    this.Activeofferingtab = false;
    this.Reservationtab = true;
    this.Pastofferingtab = false;
  }
  selectPastOffering() {
    this.Selected = 'PastOffering';
    this.Activeofferingtab = false;
    this.Reservationtab = false;
    this.Pastofferingtab = true;
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

  logout() {
    this.router.navigate(['/login'], { relativeTo: this.route });
    localStorage.clear();
  }
  onAddEditReservation(val: any) {
    this.InsAmtError = false;
    this.MinimumError = false;
    this.InvestError = false;
    this.AddEditData = val;
    this.MinInvestment = val.minimumInvestment
    this.AddEditReservationPopup = true;
    this.GetReservationById();
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
      this.ExistProfileShow = true;
      this.ExistProfileHide = true
    }
    else {
      this.InvestmentAmount = ''
      this.ExistProfileShow = false;
      this.ExistProfileHide = false
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
      if (this.ReservationId == 0) {
        this.investService.CreateReservation(reserve).subscribe(data => {
          let x: any = data
          if (x.statusCode == 1) {
            this.AddEditReservationPopup = false;
            this.toastr.success('Reservation created successfully', 'Success!')
          }
        })
      }
      else if (this.ReservationId != 0) {
        this.investService.UpdateReservation(reserve).subscribe(data => {
          let x: any = data
          if (x.statusCode == 1) {
            this.AddEditReservationPopup = false;
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

  NotificationClick() {
    this.NotificationDropdown = !this.NotificationDropdown
  }

  ClearAll() {
    this.Notification = [];
    this.accountService.ClearAllNotification(this.UserId).subscribe(data => {

    })
  }

  Read(val: any) {
    this.NotificationDropdown = true;
    this.Notification = this.Notification.filter((x: { id: any; }) => x.id != val.id);
    let notification = {
      Id: val.id,
      UserId: this.UserId,
      Status: 2
    }
    this.accountService.UpdateNotification(notification).subscribe(data => {
      if (data == true) {
        this.NotificationDropdown = true;
      }
    })
  }

  onLoadMore() {
    let length = this.Notification.length + 5
    for (let i = this.Notification.length; i < length; i++) {
      if (this.NotificationData[i] != null) {
        this.Notification.push(this.NotificationData[i])
      }
    }
  }

  GetNotification() {
    this.accountService.GetNotification(this.UserId).subscribe(data => {
      this.NotificationData = data;
      this.NotificationData = this.NotificationData.filter((x: { status: number; }) => x.status == 1)
      for (let i = 0; i < 5; i++) {
        this.Notification.push(this.NotificationData[i])
      }
    })
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

  Account1() {
    this.router.navigate(['/account'], { relativeTo: this.route });
  }

  onLogo() {
    if (this.RoleId == 1) {
      this.router.navigate(['/invest'], { relativeTo: this.route });
    }
    else if (this.RoleId == 2) {
      this.router.navigate(['/invest'], { relativeTo: this.route });
    }
    else if (this.RoleId == 3) {
      this.router.navigate(['/admin-dashboard'], { relativeTo: this.route });
    }
  }

  backToAdmin() {
    window.close();
  }
  receiveMessage(e: any) {
    // this.ProfileValue = [];
    // this.ProfileValue = e;
    this.GetProfile();
  }
}
