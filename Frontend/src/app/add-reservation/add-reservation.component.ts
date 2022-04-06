import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvestorComponent } from '../investor/investor.component';
import { InvestorService } from '../investor/investor.service';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { PortfolioService } from '../portfolio/portfolio.service';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {
  @ViewChild(PortfolioComponent) portfolioComponent: any
  @ViewChild(InvestorComponent) investorComponent: any;
  @Input() ReservationData: any;
  @Output() messageEvent = new EventEmitter<string>();
  addNewReservationShow: boolean = false;
  ModalName: any;
  AddNewReservationForm: any;
  ReservationUserId: any = 0;
  UserTypeList: any = [];
  submitted: boolean = false;
  ReservationUserError: boolean = false;
  ReservationProfileId: any = 0;
  profileList: any = [];
  ReservationProfileError: boolean = false;
  ReservationAmountZeroError: boolean = false;
  ReservationAmountError: boolean = false;
  ReservationLevelId: any = 0;
  ConfidenceLevelList: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Very Likely' },
    { id: 2, value: 'Likely' },
    { id: 3, value: 'Unlikely' }
  ];
  ReservationLevelError: boolean = false;
  Loader: boolean = false;
  reservationId: any;
  ReservationSummary: any;
  PortfolioList: any = [];
  ResertvationId: any;
  NewReservationValue: any;
  ReservationListId: any = 0;
  InvestError: boolean = false;
  ReservationList: any = [];
  UserId: any;
  AdminUserId: any;
  PTId: any;

  constructor(private formBuilder: FormBuilder,
    private _portfolio: PortfolioService,
    private toastr: ToastrService,
    private investorService: InvestorService) { }

  ngOnInit(): void {
    this.AddNewReservationForm = this.formBuilder.group({
      NewReservationName: ['', Validators.required],
      ReservationUser: ['', Validators.required],
      ReservationProfileType: ['', Validators.required],
      ReservationAmount: ['', Validators.required],
      ReservationLevel: ['', Validators.required],
    })
    this.GetReservationList();
    this.getInvestmentUserList();
  }

  get NR() { return this.AddNewReservationForm.controls }

  onAddReservation() {
    this.ModalName = 'Add';
    this.addNewReservationShow = true;
    if (this.ReservationData.ModalName == 'Add') {
      if (this.ReservationData.InvestorId != null) {
        this.ReservationUserId = this.ReservationData.InvestorId;
        this.onchangeReservationtUser(this.ReservationUserId);
        this.AddNewReservationForm.get('ReservationUser').disable();
      }
      if (this.ReservationData.ReservationId != null) {

        this.ReservationListId = this.ReservationData.ReservationId;
        this.AddNewReservationForm.get('NewReservationName').disable();
      }
    }
    this.ReservationAmountError = false;
    this.ReservationAmountZeroError = false;
  }

  EditReservation(value: any, component: any) {
    this.ModalName = "Edit"
    this.addNewReservationShow = true;
    this.ResertvationId = value.id;
    this.ReservationUserId = value.userId;
    this.onchangeReservationtUser(this.ReservationUserId);
    if (component == 'investor') {
      this.ReservationListId = value.reservationId;
      this.AddNewReservationForm.get('ReservationUser').disable();
    }
    else {
      this.ReservationListId = value.offeringId;
      this.AddNewReservationForm.get('NewReservationName').disable();
    }
    this.ReservationProfileId = value.profileId;
    this.PTId = value.profileId;
    this.AddNewReservationForm.patchValue({
      ReservationAmount: value.amount
    });
    this.ReservationLevelId = value.confidenceLevel;
  }
  onSubmitNewReservationForm(val: any) {
    this.Loader = true;
    this.submitted = true;
    if (this.AddNewReservationForm.value.NewReservationName == 0) {
      this.InvestError = true;
      this.Loader = false;
    }
    if (this.AddNewReservationForm.value.ReservationUser == 0) {
      this.ReservationUserError = true;
      this.Loader = false;
    }
    if (this.AddNewReservationForm.value.ReservationProfileType == 0) {
      this.ReservationProfileError = true;
      this.Loader = false;
    }
    if (this.AddNewReservationForm.value.ReservationLevel == 0) {
      this.ReservationLevelError = true;
      this.Loader = false;
    }
    else if (this.AddNewReservationForm.invalid) {
      this.Loader = false;
      return
    }
    else if (this.ReservationUserError == true || this.ReservationProfileError == true || this.ReservationAmountError == true
      || this.ReservationAmountZeroError == true || this.ReservationLevelError == true) {
      this.Loader = false;
      return
    }
    else {
      let ReservationModel: any = {};
      this.UserId = Number(localStorage.getItem('UserId'));
      if (this.ReservationData.InvestorId != null) {
        this.AdminUserId = this.ReservationData.InvestorId;
      }
      else {
        this.AdminUserId = this.UserId
      }
      ReservationModel.AdminUserId = this.AdminUserId;
      ReservationModel.ReservationId = this.ReservationListId;
      // ReservationModel.ReservationName = this.AddNewReservationForm.value.NewReservationName;
      ReservationModel.UserId = +this.ReservationUserId;
      ReservationModel.ProfileId = +this.ReservationProfileId;
      ReservationModel.Amount = +this.AddNewReservationForm.value.ReservationAmount;
      ReservationModel.ConfidenceLevel = +this.ReservationLevelId;
      if (val == 'Add') {
        this._portfolio.SaveNewReservation(ReservationModel).subscribe(data => {
          if (data) {
            this.toastr.success("Reservation added successfully", "Success");
            this.addNewReservationShow = false;
            this.AddNewReservationForm.reset();
            this.ReservationUserId = 0;
            this.ReservationProfileId = 0;
            this.ReservationLevelId = 0;
            this.messageEvent.emit();
            this.Loader = false;
          }
          else {
            this.Loader = false;
            this.toastr.error("Reservation can't be added", "Error");
          }
        })
      }
      else {
        ReservationModel.Id = this.ResertvationId;
        this._portfolio.UpdateNewReservation(ReservationModel).subscribe(data => {
          if (data) {
            this.toastr.success("Reservation updated successfully", "Success");
            this.addNewReservationShow = false;
            this.AddNewReservationForm.reset();
            this.ReservationUserId = 0;
            this.ReservationProfileId = 0;
            this.ReservationLevelId = 0;
            this.messageEvent.emit();
            this.Loader = false;
          }
          else {
            this.Loader = false;
            this.toastr.error("Reservation can't be updated", "Error");
          }
        })
      }
    }
  }

  onchangeReservationUser(e: any, Id: any) {
    this.AddNewReservationForm.get('ReservationUser').setValue(e.target.value);
    this.AddNewReservationForm.value.ReservationUser = e.target.value;
    let ReservationUserId = +e.target.value;
    if (ReservationUserId == 0) {
      this.ReservationUserError = true;
    }
    else {
      this.ReservationUserError = false;
      this.onchangeReservationtUser(Id);
    }
  }

  onReservationAmount(e: any) {
    this.AddNewReservationForm.get('ReservationAmount').setValue(e.target.value);
    if (e.target.value == 0) {
      this.ReservationAmountZeroError = true;
    }
    else {
      this.ReservationAmountZeroError = false;
    }
    if (this.AddNewReservationForm.value.ReservationAmount == '' || this.AddNewReservationForm.value.ReservationAmount == null) {
      this.ReservationAmountError = true;
    }
    else {
      this.ReservationAmountError = false;
    }
  }

  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }

  onchangeReservationLevel(e: any) {
    this.AddNewReservationForm.get('ReservationLevel').setValue(e.target.value);
    this.AddNewReservationForm.value.ReservationLevel = e.target.value;
    let ReservationLevelId = +e.target.value;
    if (ReservationLevelId == 0) {
      this.ReservationLevelError = true;
    }
    else {
      this.ReservationLevelError = false;
    }
  }

  onchangeProfileType(e: any) {
    this.AddNewReservationForm.get('ReservationProfileType').setValue(e.target.value);
    this.AddNewReservationForm.value.ReservationProfileType = e.target.value;
    let ReservationProfileId = +e.target.value;
    if (ReservationProfileId == 0) {
      this.ReservationProfileError = true;
    }
    else {
      this.ReservationProfileError = false;
    }
  }

  getNewReservationSummary() {
    this.Loader = true;
    this._portfolio.getReservationSummary(this.ReservationListId).subscribe(data => {
      if (data != null) {
        this.ReservationSummary = data;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  getNewReservationList() {
    this.Loader = true;
    this.PortfolioList = [];
    this._portfolio.getReservationList(this.ReservationListId).subscribe(data => {
      if (data != null) {
        this.PortfolioList = data;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  onchangeReservationtUser(value: any) {
    this.profileList = [];
    let Userid = Number(value);
    this._portfolio.getProfileType(Userid).subscribe(data => {
      if (data) {
        this.profileList = data;
        this.profileList.unshift({
          'id': 0,
          'name': 'Select Profile'
        })
      }
      if (this.PTId != null) {
        this.ReservationProfileId = this.PTId;
      }
      else {
        this.ReservationProfileId = 0;
      }
    })
  }

  getInvestmentUserList() {
    this._portfolio.getUserList().subscribe(data => {
      if (data) {
        this.UserTypeList = data;
        this.UserTypeList.unshift({
          'id': 0,
          'fullName': 'Select User'
        })
      }
    })
  }

  onChooseReservationName(e: any) {
    this.ReservationListId = +e.target.value;
    if (e.target.value == 0) {
      this.InvestError = true;
    }
    else {
      this.InvestError = false;
    }
  }

  GetReservationList() {
    this.investorService.GetReservationList().subscribe(data => {
      let x: any = data;
      this.ReservationList = [];
      this.ReservationList.push({ id: 0, name: 'Select Reservation', active: true })
      for (let i = 0; i < x.length; i++) {
        if (x[i].name != null) {
          this.ReservationList.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
      }
      this.ReservationListId = 0;
    })
  }

}
