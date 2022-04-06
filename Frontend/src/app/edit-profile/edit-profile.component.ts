import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { LeadService } from '../lead/lead.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @Input() UserProfileData: any;
  @Output() messageEvent = new EventEmitter<string>();
  EditProfilePopup: boolean = false;
  EditProfileForm: any;
  FirstnameError: boolean = false;
  LastnameError: boolean = false;
  AddEmailError: boolean = false;
  validEmail: boolean = false;
  ResidencyId: any = 0;
  CountryShow: boolean = false;
  Loader: boolean = false;
  LeadEditId: any;
  UserId: any;
  LookingInvestId: any = 0;
  InvestorDatabool: any = null;
  AccreditedInvestorId: any = 0;
  AccreditedInvestor: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Yes' },
    { id: 2, value: 'No' },
  ];
  Residency: any = [];
  LookingInvest: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Less than $10,000' },
    { id: 2, value: '$10,000 to $50,000' },
    { id: 3, value: '$50,000 to $100,000' },
    { id: 4, value: '$100,000 to $250,000' },
    { id: 5, value: 'More than $250,000' },
  ];
  InvestorData: any = [];
  token: any;
  EditIconShow: boolean = false;
  UserDetails: any;

  constructor(private formBuilder: FormBuilder,
    private leadService: LeadService,
    private toastr: ToastrService,
    private profileService: InvestorProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.UserProfileData, 'UserProfileData')
    this.token = this.router.url;
    this.UserId = Number(localStorage.getItem("UserId"));
    this.EditProfileForm = this.formBuilder.group({
      FirstName: [''],
      LastName: [''],
      NickName: [''],
      Email: [''],
      Phonenumber: [''],
      Residency: [''],
      Country: [''],
      Invest: [''],
      Creditedinvestor: [''],
      HowdidYouHear: [''],
      VerifyAccount: [''],
      NewletterUpdate: [''],
      InvestmentAnnoucements: [''],
      EmailConfirmAccount: [''],
    });
    this.GetStateProvince();
    if (this.token == "/admin-dashboard") {
      this.EditIconShow = true;
    }
    else {
      this.EditIconShow = false;
    }
  }

  onFirstName() {
    if (this.EditProfileForm.value.FirstName == '' || this.EditProfileForm.value.FirstName == null) {
      this.FirstnameError = true;
    }
    else {
      this.FirstnameError = false;
    }
  }

  onLastName() {
    if (this.EditProfileForm.value.LastName == '' || this.EditProfileForm.value.LastName == null) {
      this.LastnameError = true;
    }
    else {
      this.LastnameError = false;
    }
  }

  onEmail() {
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.EditProfileForm.value.Email == null || this.EditProfileForm.value.Email == ' ' || this.EditProfileForm.value.Email == '') {
      this.AddEmailError = true;
      this.validEmail = false;
    }
    else {
      this.AddEmailError = false;
      if (validEmailRegEx.test(this.EditProfileForm.value.Email)) {
        this.validEmail = false;
      } else {
        this.validEmail = true;
      }
    }
  }

  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }

  onchange(e: any) {
    this.EditProfileForm.get('Residency').setValue(e.target.value);
    this.EditProfileForm.value.Residency = e.target.value;
    this.ResidencyId = +e.target.value;
    if (this.ResidencyId == 1) {
      this.CountryShow = true;
    }
    else {
      this.CountryShow = false;
    }
  }

  onUpdateProfile() {
    this.Loader = true;
    if (this.EditProfileForm.value.FirstName == null || this.EditProfileForm.value.FirstName == ''
      || this.EditProfileForm.value.LastName == null || this.EditProfileForm.value.LastName == ''
      || this.EditProfileForm.value.Email == null || this.EditProfileForm.value.Email == '' || this.validEmail == true) {
      this.onFirstName();
      this.onLastName();
      this.onEmail();
      this.Loader = false;
    }
    else {
      let lead = {
        Id: this.LeadEditId != 0 ? this.LeadEditId : 0,
        AdminUserId: this.UserId,
        FirstName: this.EditProfileForm.value.FirstName,
        LastName: this.EditProfileForm.value.LastName,
        NickName: this.EditProfileForm.value.NickName,
        EmailId: this.EditProfileForm.value.Email,
        PhoneNumber: this.EditProfileForm.value.Phonenumber,
        Residency: +this.ResidencyId,
        Country: this.EditProfileForm.value.Country,
        Capacity: +this.LookingInvestId,
        IsAccreditedInvestor: this.InvestorDatabool,
        HeardFrom: this.EditProfileForm.value.HowdidYouHear,
        VerifyAccount: this.UserDetails.verifyAccount,
        CompanyNewsLetterUpdates: this.EditProfileForm.value.NewletterUpdate,
        NewInvestmentAnnouncements: this.EditProfileForm.value.InvestmentAnnoucements,
        EmailConfirmAccount: this.EditProfileForm.value.EmailConfirmAccount,
        LastLogin: this.UserDetails.lastLogin,
        Active: true,
        Status: 1,

      }
      this.leadService.UpdateLead(lead).subscribe(data => {
        if (data == 1) {
          this.EditProfilePopup = false;
          this.toastr.success("Updated successfully", "Success");
          this.messageEvent.emit();
        }
        else {
          this.EditProfilePopup = false;
          this.toastr.error("Can't updated", "Error");
          this.Loader = false;
        }
      })
    }
  }

  EditProfile() {
    console.log(this.UserProfileData, 'UserProfileData')
    this.EditProfilePopup = true;
    this.Loader = true;
    this.UserDetails = [];
    this.leadService.GetUserId(this.UserProfileData).subscribe(data => {
      this.UserDetails = data;
      if(this.UserDetails != null){

        this.LeadEditId = this.UserDetails.id
        this.EditProfileForm.patchValue({
          FirstName: this.UserDetails.firstName,
          LastName: this.UserDetails.lastName,
          NickName: this.UserDetails.nickName,
          Email: this.UserDetails.emailId,
          Phonenumber: this.UserDetails.phoneNumber,
          Residency: this.UserDetails.residency,
          Country: this.UserDetails.country,
          Invest: this.UserDetails.capacity,
          Creditedinvestor: this.UserDetails.isAccreditedInvestor,
          HowdidYouHear: this.UserDetails.heardFrom,
          NewletterUpdate: this.UserDetails.companyNewsLetterUpdates,
          InvestmentAnnoucements: this.UserDetails.newInvestmentAnnouncements,
        })
        this.ResidencyId = this.UserDetails.residency;
        this.LookingInvestId = this.UserDetails.capacity;
        if (this.UserDetails.residency == 1) {
          this.CountryShow = true;
        }
        else {
          this.CountryShow = false;
        }
        if (this.UserDetails.isAccreditedInvestor == true) {
          this.AccreditedInvestorId = 1
          this.InvestorDatabool = true;
        }
        else if (this.UserDetails.isAccreditedInvestor == false) {
          this.AccreditedInvestorId = 2;
          this.InvestorDatabool = false;
        }
        else {
          this.AccreditedInvestorId = 0
          this.InvestorDatabool = null;
        }
        this.Loader = false;
      }
      else{
        this.Loader = false;
      }
    })
  }

  GetStateProvince() {
    this.profileService.GetStateorProvince().subscribe(data => {
      let x = { id: 0, name: 'Select', active: true }
      this.Residency = data;
      this.Residency.unshift(x);
    })
  }

  oninvestor(e: any) {
    this.InvestorData = e.target.value;
    if (e.target.value == '1') {
      this.InvestorDatabool = true;
    }
    else if (e.target.value == '2') {
      this.InvestorDatabool = false;
    }
    else {
      this.InvestorDatabool = null;
    }
  }

}
