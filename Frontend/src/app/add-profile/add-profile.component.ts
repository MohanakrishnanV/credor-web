import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddBankaccountComponent } from '../add-bankaccount/add-bankaccount.component';
import { InvestorProfileComponent } from '../investor-profile/investor-profile.component';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { MyinvestmentComponent } from '../myinvestment/myinvestment.component';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.css']
})
export class AddProfileComponent implements OnInit {
  @ViewChild(AddBankaccountComponent) addBankAccountComponent: any;
  @ViewChild(AddBankaccountComponent) BankValueData: any = [];
  Bank: any;
  @ViewChild(InvestorProfileComponent) investorProfileComponent: any;
  @ViewChild(MyinvestmentComponent) myinvestmentComponent: any;
  @Input() ProfileValue: any = [];
  @Output() messageEvent = new EventEmitter<string>();
  ProfilePopup: boolean = false;
  ChooseProfileValue: any = [];
  Chooseprofile: any = '1';
  IRAForm: any;
  LLCForm: any;
  IndividualForm: any;
  TrustForm: any;
  JointForm: any;
  RetirementForm: any;
  IRAShow: boolean = false;
  LLCShow: boolean = false;
  Individualhow: boolean = false;
  TrustShow: boolean = false;
  JointShow: boolean = false;
  RetirementShow: boolean = false;
  IranameError: boolean = false;
  LlcnameError: boolean = false;
  StateProvinceId: any = '0'
  StateProvinceId1: any = '0'
  Iraname: any;
  StateorProvince: any;
  CountryStateShow: boolean = false;
  StateError: boolean = false;
  Province: any = [];
  USAddressError: boolean = false;
  CheckProvince: any = [];
  TaxError: boolean = false;
  Llcname: any;
  DisregardedEntity: any = null;
  Disregardedentity: any = '0';
  IRALLC: any = null;
  Irallc: any = '0';
  Firstname: any;
  FirstnameError: boolean = false;
  Lastname: any;
  LastnameError: boolean = false;
  Trustname: any;
  TrustnameError: boolean = false;
  Registrationname: any;
  RegistrationnameError: boolean = false;
  ArrayForm: any = [];
  FirstName: any;
  ArrayFirstnameError: boolean = false;
  LastName: any;
  ArrayLastnameError: boolean = false;
  ArrayEmail: boolean = false;
  ArrayvalidEmail: boolean = false;
  ArrayPhone: any;
  ArrayPhonelength: boolean = false;
  ArrayEmailValue: any;
  ArrayPhoneEmpty: boolean = false;
  Retirementname: any;
  RetirementnameError: boolean = false;
  Titlesignor: any;
  TitlesignorError: boolean = false;
  EditBool: boolean = false
  ViewBool: boolean = false;
  ProfileId: any = 0;
  Distributionmethod: any;
  UserData: any;
  DistributionDisabled: boolean = false;
  DistributionValue: any = [];
  DistrubutionId: any = '0';
  DistributionMethodId: any;
  BankAccountId: any = 0;
  CheckForm: any;
  OtherDetails: any;
  ACHBool: boolean = false;
  CheckBool: boolean = false;
  OtherBool: boolean = false;
  BankDetailsData: any = [];
  BankId: any = 0;
  DeleteBankPopup: boolean = false;
  BankDeleteId: any;
  showRouting: boolean = false;
  showAccount: boolean = false;
  BankPopup: boolean = false;
  BankTitleShow: boolean = false;
  BanknameError: boolean = false;
  Accounttype: any = 0;
  AccounttypeError: boolean = false;
  Routingnumber: any;
  Confirmroutingnumber: any;
  RoutingnumberError: boolean = false;
  RoutingnumberLength: boolean = false;
  ConfirmroutingnumberError: boolean = false;
  ConfirmRoutingMatch: boolean = false;
  Accountnumber: any;
  AccountnumberError: boolean = false;
  Confirmaccountnumber: any;
  ConfirmaccountnumberError: boolean = false;
  ConfirmAccountMatch: boolean = false;
  BankForm: any;
  StreetBool: boolean = false;
  CityBool: boolean = false;
  ZipcodeBool: boolean = false;
  Loader: boolean = false;
  profile: any;
  UserId: any;
  // ProfileValue: any = [];
  TotalAmount: any = 0;
  Bankname: any;
  BankDetails: any = [];
  RoleId: any;

  constructor(private profileService: InvestorProfileService,
    private toastr: ToastrService,
    private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.Loader = true;
    this.RoleId = Number(localStorage.getItem('RoleId'))
    if(this.RoleId == 3 || window.name==='Remote'){
      this.UserId = Number(localStorage.getItem('InvestorId'))
    }
    else{
      this.UserId = Number(localStorage.getItem('UserId'))
    }
    this.IRAForm = this.formbuilder.group({
      Iraname: ['', Validators.required],
      Incare: ['',],
      Streetaddress1: ['',],
      Streetaddress2: ['',],
      City: ['',],
      Province: [''],
      Country: [''],
      State: [''],
      Zipcode: [''],
      Taxid: [''],
    })
    this.CheckForm = this.formbuilder.group({
      Incare: ['',],
      Streetaddress1: ['',],
      Streetaddress2: ['',],
      City: ['',],
      Province: [''],
      Zipcode: [''],
    })
    this.LLCForm = this.formbuilder.group({
      Llcname: ['', Validators.required],
      Incare: ['',],
      Streetaddress1: ['',],
      Streetaddress2: ['',],
      City: ['',],
      Province: [''],
      Country: [''],
      State: [''],
      Zipcode: [''],
      Taxid: [''],
      Disregardedentity: [''],
      Irallc: [''],
    })
    this.IndividualForm = this.formbuilder.group({
      Firstname: ['', Validators.required],
      Lastname: ['', Validators.required],
      Streetaddress1: [''],
      Streetaddress2: [''],
      City: [''],
      Province: [''],
      Country: [''],
      State: [''],
      Zipcode: [''],
      Taxid: [''],
    })
    this.TrustForm = this.formbuilder.group({
      Trustname: ['', Validators.required],
      Incare: [''],
      Streetaddress1: [''],
      Streetaddress2: [''],
      City: [''],
      Province: [''],
      Country: [''],
      State: [''],
      Zipcode: [''],
      Taxid: [''],
    })
    this.JointForm = this.formbuilder.group({
      Registrationname: ['', Validators.required],
      Incare: [''],
      Streetaddress1: [''],
      Streetaddress2: [''],
      City: [''],
      Province: [''],
      Country: [''],
      State: [''],
      Zipcode: [''],
      Taxid: [''],
    })
    this.RetirementForm = this.formbuilder.group({
      Retirementname: ['', Validators.required],
      Titlesignor: ['', Validators.required],
      Streetaddress1: [''],
      Streetaddress2: [''],
      City: [''],
      Province: [''],
      Country: [''],
      State: [''],
      Zipcode: [''],
      Taxid: [''],
    })
    this.BankForm = this.formbuilder.group({
      Bankname: ['', Validators.required],
      Accounttype: ['', Validators.required],
      Routingnumber: ['', Validators.required],
      Confirmroutingnumber: ['', Validators.required],
      Accountnumber: ['', Validators.required],
      Confirmaccountnumber: ['', Validators.required],
    })
    this.GetChooseProfile();
    this.GetDistribution();
    this.GetStateProvince();
    this.GetProfile();
    this.GetBankDetails();
    this.GetUserById();
  }

  onChooseProfileChange(e: any) {
    this.IranameError = false;
    this.LlcnameError = false;
    this.FirstnameError = false;
    this.LastnameError = false;
    this.TrustnameError = false;
    this.RegistrationnameError = false;
    this.RetirementnameError = false;
    this.TitlesignorError = false;
    this.TaxError = false;
    this.Chooseprofile = +e.target.value;
    this.IRAForm.reset();
    this.LLCForm.reset();
    this.IndividualForm.reset();
    this.TrustForm.reset();
    this.JointForm.reset();
    this.RetirementForm.reset();
    this.StateProvinceId = 0;
    this.Distributionmethod = 0;
    if (this.Chooseprofile == 1) {
      this.IRAShow = true;
      this.LLCShow = false;
      this.Individualhow = false;
      this.TrustShow = false;
      this.JointShow = false;
      this.RetirementShow = false;
    }
    else if (this.Chooseprofile == 2) {
      this.IRAShow = false;
      this.LLCShow = true;
      this.Individualhow = false;
      this.TrustShow = false;
      this.JointShow = false;
      this.RetirementShow = false;
    }
    else if (this.Chooseprofile == 3) {
      this.IRAShow = false;
      this.LLCShow = false;
      this.Individualhow = true;
      this.TrustShow = false;
      this.JointShow = false;
      this.RetirementShow = false;
    }
    else if (this.Chooseprofile == 4) {
      this.IRAShow = false;
      this.LLCShow = false;
      this.Individualhow = false;
      this.TrustShow = true;
      this.JointShow = false;
      this.RetirementShow = false;
    }
    else if (this.Chooseprofile == 5) {
      if (this.ArrayForm.length == 0) {
        this.ArrayForm.push({
          Id: 0,
          FirstName: this.UserData.firstName,
          LastName: this.UserData.lastName,
          EmailId: this.UserData.emailId,
          Phone: this.UserData.phoneNumber,
          IsOwner: true
        })
      }
      this.IRAShow = false;
      this.LLCShow = false;
      this.Individualhow = false;
      this.TrustShow = false;
      this.JointShow = true;
      this.RetirementShow = false;
    }
    else if (this.Chooseprofile == 6) {
      this.IRAShow = false;
      this.LLCShow = false;
      this.Individualhow = false;
      this.TrustShow = false;
      this.JointShow = false;
      this.RetirementShow = true;
    }
  }
  onIRAName(e: any) {
    this.Iraname = e.target.value
    if (this.Iraname == '' || this.Iraname == null) {
      this.IranameError = true;
    }
    else {
      this.IranameError = false;
    }
  }
  onLLCNameChange(e: any) {
    this.Llcname = e.target.value
    if (this.Llcname == '' || this.Llcname == null) {
      this.LlcnameError = true;
    }
    else {
      this.LlcnameError = false;
    }
  }
  onFirstname(e: any) {
    this.Firstname = e.target.value
    if (this.Firstname == '' || this.Firstname == null) {
      this.FirstnameError = true;
    }
    else {
      this.FirstnameError = false;
    }
  }
  onLastname(e: any) {
    this.Lastname = e.target.value
    if (this.Lastname == '' || this.Lastname == null) {
      this.LastnameError = true;
    }
    else {
      this.LastnameError = false;
    }
  }
  onTrustname(e: any) {
    this.Trustname = e.target.value
    if (this.Trustname == '' || this.Trustname == null) {
      this.TrustnameError = true;
    }
    else {
      this.TrustnameError = false;
    }
  }
  onRegistrationnameChange(e: any) {
    this.Registrationname = e.target.value
    if (this.Registrationname == '' || this.Registrationname == null) {
      this.RegistrationnameError = true;
    }
    else {
      this.RegistrationnameError = false;
    }
  }
  onRetirementnameChanges(e: any) {
    this.Retirementname = e.target.value
    if (this.Retirementname == '' || this.Retirementname == null) {
      this.RetirementnameError = true;
    }
    else {
      this.RetirementnameError = false;
    }
  }
  onTitlesignorChanges(e: any) {
    this.Titlesignor = e.target.value
    if (this.Titlesignor == '' || this.Titlesignor == null) {
      this.TitlesignorError = true;
    }
    else {
      this.TitlesignorError = false;
    }
  }
  onTaxid(e: any) {
    if (e.target.value == '' || e.target.value == null) {
      this.TaxError = false;
    }
    else {
      const validtaxRegEx1 = /^\d{3}-?\d{2}-?\d{4}$/;
      const validtaxRegEx2 = /^\d{3}-?\d{3}-?\d{3}$/;
      const validtaxRegEx3 = /^\d{2}-?\d{7}$/;
      if (validtaxRegEx1.test(e.target.value) || validtaxRegEx2.test(e.target.value) || validtaxRegEx3.test(e.target.value)) {
        this.TaxError = false;
      }
      else {
        this.TaxError = true;
      }
    }
  }
  onProvinceChange(e: any) {
    this.StateorProvince = +e.target.value;
    this.StateProvinceId = +e.target.value;
    if (this.StateorProvince == 1) {
      this.CountryStateShow = true
    }
    else {
      this.CountryStateShow = false
    }
  }
  onProvinceChange1(e: any) {
    this.StateProvinceId1 = +e.target.value;
    if (this.StateProvinceId1 == 1) {
      this.CountryStateShow = true
      this.StateError = false
      this.USAddressError = true;
    }
    else if (this.StateProvinceId1 == 0) {
      this.StateError = true
      this.CountryStateShow = false
      this.USAddressError = false;
    }
    else {
      this.StateError = false
      this.CountryStateShow = false
      this.USAddressError = false;
    }
  }
  onDisregardedEntityChange(e: any) {
    if (e.target.value == '' || e.target.value == null) {
      this.DisregardedEntity = null
    }
    else if (e.target.value == 1) {
      this.DisregardedEntity = true;
    }
    else if (e.target.value == 2) {
      this.DisregardedEntity = false;
    }
  }
  onIRALLCChange(e: any) {
    if (e.target.value == '' || e.target.value == null) {
      this.IRALLC = null
    }
    else if (e.target.value == 1) {
      this.IRALLC = true;
    }
    else if (e.target.value == 2) {
      this.IRALLC = false;
    }
  }
  onArrayFirstname(e: any) {
    this.FirstName = e.target.value
    if (this.FirstName == '' || this.FirstName == null) {
      this.ArrayFirstnameError = true;
    }
    else {
      this.ArrayFirstnameError = false;
    }
  }
  onArrayLastname(e: any) {
    this.LastName = e.target.value
    if (this.LastName == '' || this.LastName == null) {
      this.ArrayLastnameError = true;
    }
    else {
      this.ArrayLastnameError = false;
    }
  }
  onArrayEmail(e: any) {
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.ArrayEmailValue = e.target.value;
    if (this.ArrayEmailValue == null || this.ArrayEmailValue == ' ' || this.ArrayEmailValue == '') {
      this.ArrayEmail = true;
      this.ArrayvalidEmail = false;
    }
    else {
      this.ArrayEmail = false;
      if (validEmailRegEx.test(this.ArrayEmailValue)) {
        this.ArrayvalidEmail = false;
      } else {
        this.ArrayvalidEmail = true;
      }
    }
  }
  onArrayPhone(e: any) {
    this.ArrayPhone = e.target.value;
    if (this.ArrayPhone == '') {
      this.ArrayPhoneEmpty = true;
      this.ArrayPhonelength = false
    }
    else {
      this.ArrayPhoneEmpty = false;
      if (e.target.value.length == 10) {
        this.ArrayPhonelength = false
      }
      else {
        this.ArrayPhonelength = true
      }
    }
  }
  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }
  onAddInvestor() {
    let arr = {
      // id: (this.ArrayForm.length + 1) * -1,
      id: 0,
      FirstName: '',
      LastName: '',
      EmailId: '',
      Phone: '',
      Active: true,
      Status: 1,
      IsOwner: false,
    }
    this.ArrayForm.push(arr);
  }
  onDistrubutionMethodChange(e: any) {
    this.DistributionMethodId = +e.target.value;
    this.Distributionmethod = +e.target.value;
    this.BankAccountId = 0;
    this.CheckForm.reset();
    this.StateProvinceId1 = 0;
    this.OtherDetails = null
    this.ViewBool = false;
    this.EditBool = false;
    this.CheckForm.enable();
    if (e.target.value == 1) {
      this.ACHBool = true;
      this.CheckBool = false;
      this.OtherBool = false;
    }
    else if (e.target.value == 2) {
      this.BankAccountId = null;
      this.ACHBool = false;
      this.CheckBool = true;
      this.OtherBool = false;
    }
    else if (e.target.value == 3) {
      this.BankAccountId = null;
      this.ACHBool = false;
      this.CheckBool = false;
      this.OtherBool = true;
    }
    else {
      this.BankAccountId = null;
      this.ACHBool = false;
      this.CheckBool = false;
      this.OtherBool = false;
    }
  }
  onBankAccountChange(e: any) {
    this.BankAccountId = +e.target.value
  }
  onBankAccount() {
    this.BankId = 0;
    this.BankPopup = true;
    this.BankTitleShow = false;
    this.BanknameError = false;
    this.AccounttypeError = false;
    this.RoutingnumberError = false;
    this.RoutingnumberLength = false;
    this.ConfirmroutingnumberError = false;
    this.ConfirmRoutingMatch = false;
    this.AccountnumberError = false;
    this.ConfirmaccountnumberError = false;
    this.ConfirmAccountMatch = false;
    this.BankForm.reset();
    this.Accounttype = 0;
  }
  onStreetChanges(e: any) {
    if (e.target.value == null || e.target.value == '' || this.CheckForm.value.Streetaddress1 == null || this.CheckForm.value.Streetaddress1 == '') {
      this.StreetBool = true;
    }
    else {
      this.StreetBool = false;
    }
  }
  onCityChanges(e: any) {
    if (e.target.value == null || e.target.value == '' || this.CheckForm.value.City == null || this.CheckForm.value.City == '') {
      this.CityBool = true;
    }
    else {
      this.CityBool = false;
    }
  }
  onZipcodeChanges(e: any) {
    if (e.target.value == null || e.target.value == '' || this.CheckForm.value.Zipcode == null || this.CheckForm.value.Zipcode == '') {
      this.ZipcodeBool = true;
    }
    else {
      this.ZipcodeBool = false;
    }
  }
  onSaveProfile() {
    this.Loader = true;
    this.DistributionMethod();
    if (this.Chooseprofile == 1) {
      if (this.IRAForm.value.Iraname == '' || this.IRAForm.value.Iraname == null) {
        this.IranameError = true;
        this.Loader = false;
      }
      else if (this.StreetBool == true || this.CityBool == true || this.ZipcodeBool == true || this.USAddressError == true || this.StateError == true) {
        this.DistributionMethod();
        this.Loader = false;
      }
      else {
        this.IranameError = false;
        if (this.TaxError == true) {
          this.TaxError = true;
          this.Loader = false;
        }
        else {
          this.profile = {
            Id: this.ProfileId != 0 ? this.ProfileId : 0,
            UserId: this.UserId,
            Type: this.Chooseprofile,
            Name: this.IRAForm.value.Iraname,
            InCareOf: this.IRAForm.value.Incare,
            StreetAddress1: this.IRAForm.value.Streetaddress1,
            StreetAddress2: this.IRAForm.value.Streetaddress2,
            City: this.IRAForm.value.City,
            StateOrProvinceId: this.StateProvinceId,
            Country: this.IRAForm.value.Country,
            State: this.IRAForm.value.State,
            ZipCode: this.IRAForm.value.Zipcode,
            TaxId: this.IRAForm.value.Taxid,
            DistributionTypeId: this.Distributionmethod,
            BankAccountId: this.BankAccountId == 0 ? null : this.BankAccountId,
            CheckInCareOf: this.CheckForm.value.Incare,
            CheckAddressLine1: this.CheckForm.value.Streetaddress1,
            CheckAddressLine2: this.CheckForm.value.Streetaddress2,
            CheckCity: this.CheckForm.value.City,
            CheckStateId: +this.StateProvinceId1,
            CheckZip: this.CheckForm.value.Zipcode,
            DistributionDetail: this.OtherDetails
          }
          this.CreateUpdateProfile();
        }
      }
    }
    else if (this.Chooseprofile == 2) {
      if (this.LLCForm.value.Llcname == null || this.LLCForm.value.Llcname == '') {
        this.LlcnameError = true;
        this.Loader = false;
      }
      else if (this.StreetBool == true || this.CityBool == true || this.ZipcodeBool == true || this.USAddressError == true || this.StateError == true) {
        this.DistributionMethod();
        this.Loader = false;
      }
      else {
        this.LlcnameError = false;
        if (this.TaxError == true) {
          this.TaxError = true;
          this.Loader = false;
        }
        else {
          if (this.DisregardedEntity == 1 || this.DisregardedEntity == true) {
            this.DisregardedEntity = true;
          }
          else if (this.DisregardedEntity == 2 || this.DisregardedEntity == false) {
            this.DisregardedEntity = false
          }
          else if (this.DisregardedEntity == 0 || this.DisregardedEntity == null) {
            this.DisregardedEntity = null
          }
          if (this.IRALLC == 1 || this.IRALLC == true) {
            this.IRALLC = true;
          }
          else if (this.IRALLC == 2 || this.IRALLC == false) {
            this.IRALLC = false
          }
          else if (this.IRALLC == 0 || this.IRALLC == null) {
            this.IRALLC = null
          }
          this.profile = {
            Id: this.ProfileId != 0 ? this.ProfileId : 0,
            UserId: this.UserId,
            Type: this.Chooseprofile,
            Name: this.LLCForm.value.Llcname,
            InCareOf: this.LLCForm.value.Incare,
            StreetAddress1: this.LLCForm.value.Streetaddress1,
            StreetAddress2: this.LLCForm.value.Streetaddress2,
            City: this.LLCForm.value.City,
            StateOrProvinceId: this.StateProvinceId,
            Country: this.LLCForm.value.Country,
            State: this.LLCForm.value.State,
            ZipCode: this.LLCForm.value.Zipcode,
            TaxId: this.LLCForm.value.Taxid,
            IsDisregardedEntity: this.DisregardedEntity,
            IsIRALLC: this.IRALLC,
            DistributionTypeId: this.Distributionmethod,
            BankAccountId: this.BankAccountId == 0 ? null : this.BankAccountId,
            CheckInCareOf: this.CheckForm.value.Incare,
            CheckAddressLine1: this.CheckForm.value.Streetaddress1,
            CheckAddressLine2: this.CheckForm.value.Streetaddress2,
            CheckCity: this.CheckForm.value.City,
            CheckStateId: +this.StateProvinceId1,
            CheckZip: this.CheckForm.value.Zipcode,
            DistributionDetail: this.OtherDetails
          }
          this.CreateUpdateProfile();
        }
      }
    }
    else if (this.Chooseprofile == 3) {
      if (this.TaxError == true || this.IndividualForm.value.Firstname == null || this.IndividualForm.value.Firstname == ''
        || this.IndividualForm.value.Lastname == null || this.IndividualForm.value.Lastname == '') {
        if (this.IndividualForm.value.Firstname == null || this.IndividualForm.value.Firstname == '') {
          this.FirstnameError = true;
        }
        else {
          this.FirstnameError = false;
        }
        if (this.IndividualForm.value.Lastname == null || this.IndividualForm.value.Lastname == '') {
          this.LastnameError = true;
        }
        else {
          this.LastnameError = false;
        }
        if (this.TaxError == true) {
          this.TaxError = true;
        }
        this.Loader = false;
      }
      else if (this.StreetBool == true || this.CityBool == true || this.ZipcodeBool == true || this.USAddressError == true || this.StateError == true) {
        this.DistributionMethod();
        this.Loader = false;
      }
      else {
        this.profile = {
          Id: this.ProfileId != 0 ? this.ProfileId : 0,
          UserId: this.UserId,
          Type: this.Chooseprofile,
          FirstName: this.IndividualForm.value.Firstname,
          LastName: this.IndividualForm.value.Lastname,
          StreetAddress1: this.IndividualForm.value.Streetaddress1,
          StreetAddress2: this.IndividualForm.value.Streetaddress2,
          City: this.IndividualForm.value.City,
          StateOrProvinceId: this.StateProvinceId,
          Country: this.IndividualForm.value.Country,
          State: this.IndividualForm.value.State,
          ZipCode: this.IndividualForm.value.Zipcode,
          TaxId: this.IndividualForm.value.Taxid,
          DistributionTypeId: this.Distributionmethod,
          BankAccountId: this.BankAccountId == 0 ? null : this.BankAccountId,
          CheckInCareOf: this.CheckForm.value.Incare,
          CheckAddressLine1: this.CheckForm.value.Streetaddress1,
          CheckAddressLine2: this.CheckForm.value.Streetaddress2,
          CheckCity: this.CheckForm.value.City,
          CheckStateId: +this.StateProvinceId1,
          CheckZip: this.CheckForm.value.Zipcode,
          DistributionDetail: this.OtherDetails
        }
        this.CreateUpdateProfile();
      }
    }
    else if (this.Chooseprofile == 4) {
      if (this.TrustForm.value.Trustname == null || this.TrustForm.value.Trustname == '') {
        this.TrustnameError = true;
        this.Loader = false;
      }
      else if (this.StreetBool == true || this.CityBool == true || this.ZipcodeBool == true || this.USAddressError == true || this.StateError == true) {
        this.DistributionMethod();
        this.Loader = false;
      }
      else {
        this.TrustnameError = false;
        if (this.TaxError == true) {
          this.TaxError = true;
          this.Loader = false;
        }
        else {
          this.profile = {
            Id: this.ProfileId != 0 ? this.ProfileId : 0,
            UserId: this.UserId,
            Type: this.Chooseprofile,
            TrustName: this.TrustForm.value.Trustname,
            InCareOf: this.TrustForm.value.Incare,
            StreetAddress1: this.TrustForm.value.Streetaddress1,
            StreetAddress2: this.TrustForm.value.Streetaddress2,
            City: this.TrustForm.value.City,
            StateOrProvinceId: this.StateProvinceId,
            Country: this.TrustForm.value.Country,
            State: this.TrustForm.value.State,
            ZipCode: this.TrustForm.value.Zipcode,
            TaxId: this.TrustForm.value.Taxid,
            DistributionTypeId: this.Distributionmethod,
            BankAccountId: this.BankAccountId == 0 ? null : this.BankAccountId,
            CheckInCareOf: this.CheckForm.value.Incare,
            CheckAddressLine1: this.CheckForm.value.Streetaddress1,
            CheckAddressLine2: this.CheckForm.value.Streetaddress2,
            CheckCity: this.CheckForm.value.City,
            CheckStateId: +this.StateProvinceId1,
            CheckZip: this.CheckForm.value.Zipcode,
            DistributionDetail: this.OtherDetails
          }
          this.CreateUpdateProfile();
        }
      }
    }
    else if (this.Chooseprofile == 5) {
      if (this.JointForm.value.Registrationname == null || this.JointForm.value.Registrationname == '') {
        this.RegistrationnameError = true;
        this.Loader = false;
      }
      else {
        this.RegistrationnameError = false;
      }
      this.AddInvestorCheck();
      if (this.TaxError == true) {
        this.TaxError = true;
        this.Loader = false;
      }
      else if (this.StreetBool == true || this.CityBool == true || this.ZipcodeBool == true || this.USAddressError == true || this.StateError == true) {
        this.DistributionMethod();
        this.Loader = false;
      }
      else {
        this.TaxError = false;
        if (this.RegistrationnameError == false && this.ArrayFirstnameError == false && this.ArrayLastnameError == false
          && this.ArrayvalidEmail == false && this.ArrayEmail == false && this.ArrayPhoneEmpty == false) {
          this.profile = {
            Id: this.ProfileId != 0 ? this.ProfileId : 0,
            UserId: this.UserId,
            Type: this.Chooseprofile,
            Name: this.JointForm.value.Registrationname,
            InCareOf: this.JointForm.value.Incare,
            StreetAddress1: this.JointForm.value.Streetaddress1,
            StreetAddress2: this.JointForm.value.Streetaddress2,
            City: this.JointForm.value.City,
            StateOrProvinceId: this.StateProvinceId,
            Country: this.JointForm.value.Country,
            State: this.JointForm.value.State,
            ZipCode: this.JointForm.value.Zipcode,
            TaxId: this.JointForm.value.Taxid,
            DistributionTypeId: this.Distributionmethod,
            Investers: this.ArrayForm,
            BankAccountId: this.BankAccountId == 0 ? null : this.BankAccountId,
            CheckInCareOf: this.CheckForm.value.Incare,
            CheckAddressLine1: this.CheckForm.value.Streetaddress1,
            CheckAddressLine2: this.CheckForm.value.Streetaddress2,
            CheckCity: this.CheckForm.value.City,
            CheckStateId: +this.StateProvinceId1,
            CheckZip: this.CheckForm.value.Zipcode,
            DistributionDetail: this.OtherDetails
          }
          this.CreateUpdateProfile();
        }
      }
    }
    else if (this.Chooseprofile == 6) {
      if (this.TaxError == true
        || this.RetirementForm.value.Retirementname == null || this.RetirementForm.value.Retirementname == ''
        || this.RetirementForm.value.Titlesignor == null || this.RetirementForm.value.Titlesignor == ''
      ) {
        if (this.RetirementForm.value.Retirementname == null || this.RetirementForm.value.Retirementname == '') {
          this.RetirementnameError = true;
        }
        else {
          this.RetirementnameError = false;
        }
        if (this.RetirementForm.value.Titlesignor == null || this.RetirementForm.value.Titlesignor == '') {
          this.TitlesignorError = true;
        }
        else {
          this.TitlesignorError = false;
        }
        if (this.TaxError == true) {
          this.TaxError = true;
        }
        this.Loader = false;
      }
      else if (this.StreetBool == true || this.CityBool == true || this.ZipcodeBool == true || this.USAddressError == true || this.StateError == true) {
        this.DistributionMethod();
        this.Loader = false;
      }
      else {
        this.profile = {
          Id: this.ProfileId != 0 ? this.ProfileId : 0,
          UserId: this.UserId,
          Type: this.Chooseprofile,
          RetirementPlanName: this.RetirementForm.value.Retirementname,
          SignorName: this.RetirementForm.value.Titlesignor,
          StreetAddress1: this.RetirementForm.value.Streetaddress1,
          StreetAddress2: this.RetirementForm.value.Streetaddress2,
          City: this.RetirementForm.value.City,
          StateOrProvinceId: this.StateProvinceId,
          Country: this.RetirementForm.value.Country,
          State: this.RetirementForm.value.State,
          ZipCode: this.RetirementForm.value.Zipcode,
          TaxId: this.RetirementForm.value.Taxid,
          DistributionTypeId: this.Distributionmethod,
          BankAccountId: this.BankAccountId == 0 ? null : this.BankAccountId,
          CheckInCareOf: this.CheckForm.value.Incare,
          CheckAddressLine1: this.CheckForm.value.Streetaddress1,
          CheckAddressLine2: this.CheckForm.value.Streetaddress2,
          CheckCity: this.CheckForm.value.City,
          CheckStateId: +this.StateProvinceId1,
          CheckZip: this.CheckForm.value.Zipcode,
          DistributionDetail: this.OtherDetails
        }
        this.CreateUpdateProfile();
      }
    }
  }
  private CreateUpdateProfile() {
    if (this.ProfileId == 0) {
      this.profileService.CreateProfile(this.profile).subscribe(data => {
        if (data == 1) {
          this.ProfilePopup = false;
          this.GetProfile();
          this.toastr.success("Profile created successfully", "Success!")
        }
        else {
          this.toastr.error('Data not saved');
          this.Loader = false;
        }
      });
    }
    else {
      this.profileService.UpdateProfile(this.profile).subscribe(data => {
        if (data == 1) {
          this.ProfilePopup = false;
          this.GetProfile();
          this.toastr.success("Profile updated successfully", "Success!")
        }
        else {
          this.toastr.error('Data not saved');
          this.Loader = false;
        }
      });
    }
  }
  GetProfile() {
    this.profileService.GetProfileById(this.UserId).subscribe(data => {
      this.ProfileValue = data;
      for (let i = 0; i < this.ProfileValue.length; i++) {
        this.TotalAmount = 0;
        let x = this.ProfileValue[i].investments
        for (let j = 0; j < x.length; j++) {
          this.TotalAmount = this.TotalAmount + x[j].amount
        }
        this.ProfileValue[i].TotalAmount = this.TotalAmount
        this.ProfileValue[i].Length = x.length
      }
      this.messageEvent.emit(this.ProfileValue)
      this.Loader = false;
    })
  }
  DistributionMethod() {
    if (this.Distributionmethod == 2) {
      if (this.CheckForm.value.Streetaddress1 == null || this.CheckForm.value.Streetaddress1 == '') {
        this.StreetBool = true;
      }
      else {
        this.StreetBool = false;
      }
      if (this.CheckForm.value.City == null || this.CheckForm.value.City == '') {
        this.CityBool = true;
      }
      else {
        this.CityBool = false;
      }
      if (this.CheckForm.value.Zipcode == null || this.CheckForm.value.Zipcode == '') {
        this.ZipcodeBool = true;
      }
      else {
        this.ZipcodeBool = false;
      }
      if (this.StateProvinceId1 == 1) {
        this.CountryStateShow = true
        this.StateError = false
      }
      else if (this.StateProvinceId1 == 0) {
        this.StateError = true
        this.CountryStateShow = false
      }
      else {
        this.StateError = false
        this.CountryStateShow = false
      }
    }
  }
  private AddInvestorCheck() {
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    for (let i = 0; i < this.ArrayForm.length; i++) {
      if (this.ArrayForm[i].FirstName == '' || this.ArrayForm[i].FirstName == null) {
        this.ArrayFirstnameError = true;
      }
      else {
        this.ArrayFirstnameError = false;
      }
      if (this.ArrayForm[i].LastName == '' || this.ArrayForm[i].LastName == null) {
        this.ArrayLastnameError = true;
      }
      else {
        this.ArrayLastnameError = false;
      }
      if (this.ArrayForm[i].EmailId == null || this.ArrayForm[i].EmailId == ' ' || this.ArrayForm[i].EmailId == '') {
        this.ArrayEmail = true;
        this.ArrayvalidEmail = false;
      }
      else {
        this.ArrayEmail = false;
        if (validEmailRegEx.test(this.ArrayForm[i].EmailId)) {
          this.ArrayvalidEmail = false;
        } else {
          this.ArrayvalidEmail = true;
        }
      }
      if (this.ArrayForm[i].Phone == '') {
        this.ArrayPhoneEmpty = true;
      }
      else {
        this.ArrayPhoneEmpty = false;
      }
    }
  }
  onBanknameChanges(e: any) {
    this.Bankname = e.target.value
    if (this.Bankname == '' || this.Bankname == null) {
      this.BanknameError = true;
    }
    else {
      this.BanknameError = false;
    }
  }
  onAccounttypeChanges(e: any) {
    this.Accounttype = +e.target.value
    if (this.Accounttype == 0) {
      this.AccounttypeError = true;
    }
    else {
      this.AccounttypeError = false;
    }
  }
  onRoutingnumChanges(e: any) {
    this.Routingnumber = e.target.value
    if (this.Routingnumber == '' || this.Routingnumber == null) {
      this.RoutingnumberError = true;
      this.RoutingnumberLength = false;
    }
    else {
      this.RoutingnumberError = false;
      if (this.Routingnumber.length < 9) {
        this.RoutingnumberLength = true;
      }
      else {
        this.RoutingnumberLength = false;
      }
    }
  }
  onConRoutingnumChanges(e: any) {
    this.Confirmroutingnumber = e.target.value
    if (this.Confirmroutingnumber == '' || this.Confirmroutingnumber == null) {
      this.ConfirmroutingnumberError = true;
      this.ConfirmRoutingMatch = false
    }
    else {
      this.ConfirmroutingnumberError = false;
      if (this.Routingnumber == this.Confirmroutingnumber || this.BankForm.value.Routingnumber == this.BankForm.value.Confirmroutingnumber) {
        this.ConfirmRoutingMatch = false
      }
      else {
        this.ConfirmRoutingMatch = true;
      }
    }
  }
  onAccountnumberChanges(e: any) {
    this.Accountnumber = e.target.value
    if (this.Accountnumber == '' || this.Accountnumber == null) {
      this.AccountnumberError = true;
    }
    else {
      this.AccountnumberError = false;
    }
  }
  onConfirmaccountnumChanges(e: any) {
    this.Confirmaccountnumber = e.target.value;
    if (this.Confirmaccountnumber == '' || this.Confirmaccountnumber == null) {
      this.ConfirmaccountnumberError = true;
      this.ConfirmAccountMatch = false
    }
    else {
      this.ConfirmaccountnumberError = false;
      if (this.Accountnumber == this.Confirmaccountnumber || this.BankForm.value.Accountnumber == this.BankForm.value.Confirmaccountnumber) {
        this.ConfirmAccountMatch = false
      }
      else {
        this.ConfirmAccountMatch = true;
      }
    }
  }
  Routing() {
    this.showRouting = !this.showRouting;
  }

  Account() {
    this.showAccount = !this.showAccount;
  }
  onBankSave() {
    this.Loader = true;
    if (this.BankForm.value.Bankname == null || this.BankForm.value.Bankname == ''
      || this.BankForm.value.Accounttype == 0
      || this.BankForm.value.Routingnumber == null || this.BankForm.value.Routingnumber == '' || this.BankForm.value.Routingnumber.length < 9
      || this.BankForm.value.Confirmroutingnumber == null || this.BankForm.value.Confirmroutingnumber == '' || this.BankForm.value.Routingnumber != this.BankForm.value.Confirmroutingnumber
      || this.BankForm.value.Accountnumber == null || this.BankForm.value.Accountnumber == ''
      || this.BankForm.value.Confirmaccountnumber == null || this.BankForm.value.Confirmaccountnumber == '' || this.BankForm.value.Accountnumber != this.BankForm.value.Confirmaccountnumber) {
      if (this.BankForm.value.Bankname == '' || this.BankForm.value.Bankname == null) {
        this.BanknameError = true;
      }
      else {
        this.BanknameError = false;
      }
      if (this.Accounttype == 0) {
        this.AccounttypeError = true;
      }
      else {
        this.AccounttypeError = false;
      }
      if (this.BankForm.value.Routingnumber == '' || this.BankForm.value.Routingnumber == null) {
        this.RoutingnumberError = true;
        this.RoutingnumberLength = false;
      }
      else {
        this.RoutingnumberError = false;
        if (this.BankForm.value.Routingnumber.length < 9) {
          this.RoutingnumberLength = true;
        }
        else {
          this.RoutingnumberLength = false;
        }
      }
      if (this.BankForm.value.Confirmroutingnumber == '' || this.BankForm.value.Confirmroutingnumber == null) {
        this.ConfirmroutingnumberError = true;
        this.ConfirmRoutingMatch = false
      }
      else {
        this.ConfirmroutingnumberError = false;
        if (this.BankForm.value.Routingnumber == this.BankForm.value.Confirmroutingnumber) {
          this.ConfirmRoutingMatch = false
        }
        else {
          this.ConfirmRoutingMatch = true;
        }
      }
      if (this.BankForm.value.Accountnumber == '' || this.BankForm.value.Accountnumber == null) {
        this.AccountnumberError = true;
      }
      else {
        this.AccountnumberError = false;
      }
      if (this.BankForm.value.Confirmaccountnumber == '' || this.BankForm.value.Confirmaccountnumber == null) {
        this.ConfirmaccountnumberError = true;
        this.ConfirmAccountMatch = false
      }
      else {
        this.ConfirmaccountnumberError = false;
        if (this.BankForm.value.Accountnumber == this.BankForm.value.Confirmaccountnumber) {
          this.ConfirmAccountMatch = false
        }
        else {
          this.ConfirmAccountMatch = true;
        }
      }
      this.Loader = false;
    }
    else {
      let bank = {
        Id: this.BankId != 0 ? this.BankId : 0,
        UserId: this.UserId,
        BankName: this.BankForm.value.Bankname,
        AccountType: this.Accounttype,
        RoutingNumber: this.BankForm.value.Routingnumber,
        AccountNumber: this.BankForm.value.Accountnumber,
      }
      if (this.BankId == 0) {
        this.profileService.CreateBank(bank).subscribe(data => {
          if (data == 1) {
            this.GetBankDetails();
            this.BankPopup = false;
            this.toastr.success("Bank account created successfully", "Success!")
          }
          else {
            this.toastr.error("Data not saved", 'Error!')
          }
        })
      }
      else if (this.BankId != 0) {
        this.profileService.UpdateBank(bank).subscribe(data => {
          if (data == 1) {
            this.BankPopup = false;
            this.GetBankDetails();
            this.toastr.success("Bank account updated successfully", "Success!")
          }
          else {
            this.toastr.error("Data not saved", 'Error!')
          }
        })
      }
    }
  }
  GetBankDetails() {
    this.profileService.GetBankDetails(this.UserId).subscribe(data => {
      this.BankDetails = data;
      this.BankDetailsData = [];
      this.BankDetailsData.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < this.BankDetails.length; i++) {
        this.BankDetailsData.push({ id: this.BankDetails[i].id, name: this.BankDetails[i].bankName + '(' + this.BankDetails[i].accountNumber + ')', active: this.BankDetails[i].active })
      }
      this.Loader = false;
    })
  }
  onNewProfile() {
    this.ProfilePopup = true;
    this.IRAShow = true;
    this.LLCShow = false;
    this.Individualhow = false;
    this.TrustShow = false;
    this.JointShow = false;
    this.RetirementShow = false;
    this.Chooseprofile = 1
    this.IRAForm.reset();
    this.ArrayForm = [];
    this.StateProvinceId = 0;
    this.Distributionmethod = 0;
    this.IranameError = false;
    this.LlcnameError = false;
    this.FirstnameError = false;
    this.LastnameError = false;
    this.TrustnameError = false;
    this.RegistrationnameError = false;
    this.RetirementnameError = false;
    this.TitlesignorError = false;
    this.TaxError = false;
    this.ProfileId = 0
    this.ViewBool = false;
    this.EditBool = false;
    this.IRAForm.enable();
    this.LLCForm.enable();
    this.IndividualForm.enable();
    this.TrustForm.enable();
    this.JointForm.enable();
    this.RetirementForm.enable();
    this.ACHBool = false;
    this.CheckBool = false;
    this.OtherBool = false;
    this.DistributionDisabled = false;
    this.GetBankDetails();
  }
  GetChooseProfile() {
    this.profileService.GetChooseProfile().subscribe(data => {
      this.ChooseProfileValue = data
    })
  }
  GetDistribution() {
    this.profileService.GetDistribution().subscribe(data => {
      let x: any = data;
      this.DistributionValue.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.DistributionValue.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  GetStateProvince() {
    this.profileService.GetStateorProvince().subscribe(data => {
      let x: any = data
      this.Province.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.Province.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
      this.CheckProvince = this.Province;
    })
  }
  GetUserById() {
    this.profileService.GetUserById(this.UserId).subscribe(data => {
      this.UserData = data;
    })
  }
  onProfileEdit(value: any, e: any) {
    console.log(this.BankDetailsData,'BankDetailsData')
    this.ProfileId = value.profileDisplayId
    this.BankAccountId = null
    if (e == 'edit') {
      this.EditBool = true;
      this.ViewBool = false;
      this.IRAForm.enable();
      this.LLCForm.enable();
      this.IndividualForm.enable();
      this.TrustForm.enable();
      this.JointForm.enable();
      this.RetirementForm.enable();
      this.CheckForm.enable();
      this.DistributionDisabled = false
    }
    else {
      this.EditBool = false
      this.ViewBool = true;
      this.IRAForm.disable();
      this.LLCForm.disable();
      this.IndividualForm.disable();
      this.TrustForm.disable();
      this.JointForm.disable();
      this.RetirementForm.disable();
      this.CheckForm.disable();
      this.DistributionDisabled = true;
    }
    this.ProfilePopup = true;

    this.IRAShow = false;
    this.LLCShow = false;
    this.Individualhow = false;
    this.TrustShow = false;
    this.JointShow = false;
    this.RetirementShow = false;

    this.Chooseprofile = value.type;
    this.StateProvinceId = value.stateOrProvinceId;
    if (value.stateOrProvinceId == 1) {
      this.CountryStateShow = true;
    }
    this.Distributionmethod = value.distributionTypeId;
    if (this.Distributionmethod == 1) {
      this.ACHBool = true;
      this.CheckBool = false;
      this.OtherBool = false;
      this.BankAccountId = value.bankAccountId
    }
    else if (this.Distributionmethod == 2) {
      this.CheckBool = true;
      this.ACHBool = false;
      this.OtherBool = false;
      this.CheckForm.patchValue({
        Incare: value.checkInCareOf,
        Streetaddress1: value.checkAddressLine1,
        Streetaddress2: value.checkAddressLine2,
        City: value.checkCity,
        Province: value.checkStateId,
        Zipcode: value.checkZip,
      })
      this.StateProvinceId1 = value.checkStateId
      this.BankAccountId = null
    }
    else if (this.Distributionmethod == 3) {
      this.OtherBool = true;
      this.ACHBool = false;
      this.CheckBool = false;
      this.OtherDetails = value.distributionDetail
      this.BankAccountId = null
    }
    else {
      this.ACHBool = false;
      this.CheckBool = false;
      this.OtherBool = false;
      this.BankAccountId = null
    }
    if (value.type == 1) {
      this.IRAShow = true;
      this.IRAForm.patchValue({
        Iraname: value.name,
        Incare: value.inCareOf,
        Streetaddress1: value.streetAddress1,
        Streetaddress2: value.streetAddress2,
        City: value.city,
        Province: value.stateOrProvinceId,
        Country: value.country,
        State: value.state,
        Zipcode: value.zipCode,
        Taxid: value.taxId,
      })
    }
    if (value.type == 2) {
      this.LLCShow = true;
      let Idy: any;
      let Iral: any;
      if (value.isDisregardedEntity == null) {
        this.Disregardedentity = 0;
      }
      else if (value.isDisregardedEntity == true) {
        this.Disregardedentity = 1;
      }
      else {
        this.Disregardedentity = 2;
      }
      if (value.isIRALLC == null) {
        this.Irallc = 0;
      }
      else if (value.isIRALLC == true) {
        this.Irallc = 1;
      }
      else {
        this.Irallc = 2;
      }
      this.LLCForm.patchValue({
        Llcname: value.name,
        Incare: value.inCareOf,
        Streetaddress1: value.streetAddress1,
        Streetaddress2: value.streetAddress2,
        City: value.city,
        Province: value.stateOrProvinceId,
        Country: value.country,
        State: value.state,
        Zipcode: value.zipCode,
        Taxid: value.taxId,
        Disregardedentity: this.Disregardedentity,
        Irallc: this.Irallc
      })
    }
    if (value.type == 3) {
      this.Individualhow = true;
      this.IndividualForm.patchValue({
        Firstname: value.firstName,
        Lastname: value.lastName,
        Streetaddress1: value.streetAddress1,
        Streetaddress2: value.streetAddress2,
        City: value.city,
        Province: value.stateOrProvinceId,
        Country: value.country,
        State: value.state,
        Zipcode: value.zipCode,
        Taxid: value.taxId,
      })
    }
    if (value.type == 4) {
      this.TrustShow = true;
      this.TrustForm.patchValue({
        Trustname: value.trustName,
        Incare: value.inCareOf,
        Streetaddress1: value.streetAddress1,
        Streetaddress2: value.streetAddress2,
        City: value.city,
        Province: value.stateOrProvinceId,
        Country: value.country,
        State: value.state,
        Zipcode: value.zipCode,
        Taxid: value.taxId,
      })
    }
    if (value.type == 5) {
      this.ArrayForm = [];
      for (let i = 0; i < value.investers.length; i++) {
        this.ArrayForm.push({
          Id: value.investers[i].id,
          FirstName: value.investers[i].firstName,
          LastName: value.investers[i].lastName,
          EmailId: value.investers[i].emailId,
          Phone: value.investers[i].phone,
          IsOwner: value.investers[i].isOwner,
        })
      }
      this.JointShow = true;
      this.JointForm.patchValue({
        Registrationname: value.name,
        Incare: value.inCareOf,
        Streetaddress1: value.streetAddress1,
        Streetaddress2: value.streetAddress2,
        City: value.city,
        Province: value.stateOrProvinceId,
        Country: value.country,
        State: value.state,
        Zipcode: value.zipCode,
        Taxid: value.taxId,
      })
    }
    if (value.type == 6) {
      this.RetirementShow = true;
      this.RetirementForm.patchValue({
        Retirementname: value.retirementPlanName,
        Titlesignor: value.signorName,
        Streetaddress1: value.streetAddress1,
        Streetaddress2: value.streetAddress2,
        City: value.city,
        Province: value.stateOrProvinceId,
        Country: value.country,
        State: value.state,
        Zipcode: value.zipCode,
        Taxid: value.taxId,
      })
    }
  }
  onEditProfile() {
    this.ViewBool = false;
    this.EditBool = true;
    this.IRAForm.enable();
    this.LLCForm.enable();
    this.IndividualForm.enable();
    this.TrustForm.enable();
    this.JointForm.enable();
    this.RetirementForm.enable();
    this.CheckForm.enable();
    this.DistributionDisabled = false;
  }
  BankReturnData(e: any) {
    this.BankDetailsData = [];
    this.BankDetailsData.push({ id: 0, name: 'Select', active: true })
    for (let i = 0; i < e.length; i++) {
      this.BankDetailsData.push({ id: e[i].id, name: e[i].bankName + '(' + e[i].accountNumber + ')', active: e[i].active })
    }
  }

}
