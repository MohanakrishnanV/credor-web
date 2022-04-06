// import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { InvestService } from '../invest/invest.service';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { InvestmentService } from './investment.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css'],
  // providers : [CurrencyPipe]
})
export class InvestmentComponent implements OnInit {
  @ViewChild(AddProfileComponent) addProfileComponent : any;
  @ViewChild(AddProfileComponent) ProfileValueData: any = [];
  Profile : any
  token: any;
  UserId: any;
  InvestmentData: any;
  KeyHighlights: any = [];
  DiligenceShow: boolean = false;
  InvestShow: boolean = false;
  ESignShow: boolean = false;
  FundInvestmentShow: boolean = false;
  InvestorTerms: any;
  InvestorTermsDisabled: boolean = false;
  EsignCheckDisabled: boolean = false;
  ProfileValue: any = [];
  InvestingProfile: any = 0;
  MinInvestment: any;
  InvestmentAmount: any;
  InvestError: boolean = false;
  InsAmtError: boolean = false;
  MinimumError: boolean = false;
  Offeringtoken: any;
  InvestmentTab: any;
  OfferingtokenName: any;
  ChooseProfileValue: any = [];
  Chooseprofile: any = '1';
  Iraname: any;
  StateorProvince: any;
  Province: any = [];
  Llcname: any;
  Firstname: any;
  LastName: any;
  ArrayLastnameError: boolean = false;
  ArrayEmail: boolean = false;
  ArrayvalidEmail: boolean = false;
  ArrayPhone: any;
  ArrayPhonelength: boolean = false;
  ArrayEmailValue: any;
  ArrayPhoneEmpty: boolean = false;
  Retirementname: any;
  Titlesignor: any;
  BankDetails: any = [];
  profile: any;
  ProfileId: any = 0;
  BankId: any = 0;
  DeleteBankPopup: boolean = false;
  Accountnumber: any;
  Bankname: any;
  showAccount: boolean = false;
  UserData: any;
  Loader : boolean = false;
  diligenceshow : boolean = false;
  diligencedone : boolean = false
  investshow : boolean = false;
  investdone : boolean = false
  esignshow : boolean = false;
  esigndone : boolean = false
  fundshow : boolean = false;
  funddone : boolean = false
  EsignCheck: any;
  InvestmentId: any;
  WireTransferDate : any;
  StepNavShow : boolean = true;
  FundingDataDetails: any;

  constructor(private router: Router,
    private investService: InvestService,
    private profileService: InvestorProfileService,
    private investmentService: InvestmentService,
    private formbuilder : FormBuilder,
    private toastr : ToastrService,
    // private currencyPipe : CurrencyPipe,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.Loader = true;
    this.token = +this.route.snapshot.params['id'];
    this.Offeringtoken = +this.route.snapshot.params['offId']
    this.OfferingtokenName = this.route.snapshot.params['name']
    this.UserId = Number(localStorage.getItem('UserId'))
    this.DiligenceShow = true;
    this.diligenceshow = true
    this.GetMarketplaceById();
    this.GetProfile();
    this.GetChooseProfile();
    this.GetUserById();
    this.GetFundingDetails();
    if(this.OfferingtokenName == null || this.OfferingtokenName == 'undefined'){
      this.Loader = false;
    }
    else{
      this.GetInvestmentByTab();
    }
  }

  GetMarketplaceById() {
    this.investService.GetMarketplaceById(this.token).subscribe(data => {
      this.InvestmentData = data;
      console.log(this.InvestmentData,'investmentdata')
      for (let i = 0; i < this.InvestmentData.keyHighlights.length; i++) {
        if (i == 0 || i == 1 || i == 2) {
          this.KeyHighlights.push(this.InvestmentData.keyHighlights[i])
        }
      }
      this.MinInvestment = this.InvestmentData.minimumInvestment;
      this.StepNavShow = true;
    })
  }
  onBack() {
    if(this.OfferingtokenName != null){
      this.router.navigate(['./../../../../myinvestment'], { relativeTo: this.route });
    }
    else{
      this.router.navigate(['./../../invest'], { relativeTo: this.route });
    }
  }
  onInvestorTermsChanges(e: any) {
    if (this.InvestorTerms == true) {
      this.InvestorTermsDisabled = true;
    }
    else {
      this.InvestorTermsDisabled = false;
    }
  }
  DiligenceNext() {
    this.DiligenceShow = false;
    this.InvestShow = true;
    this.ESignShow = false;
    this.FundInvestmentShow = false;
    this.diligencedone = true;
    this.investshow = true;
    this.investdone = false;
    this.InvestmentId = 0;
  }
  GetProfile() {
    this.profileService.GetProfileById(this.UserId).subscribe(data => {
      let x: any = data;
      this.ProfileValue = [];
      this.ProfileValue.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        if(x[i].name != null){
          this.ProfileValue.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
        else if(x[i].firstName != null){
          this.ProfileValue.push({ id: x[i].id, name: x[i].firstName, active: x[i].active })
        }
        else if(x[i].trustName != null){
          this.ProfileValue.push({ id: x[i].id, name: x[i].trustName, active: x[i].active })
        }
        else if(x[i].retirementPlanName != null){
          this.ProfileValue.push({ id: x[i].id, name: x[i].retirementPlanName, active: x[i].active })
        }
      }
    })
  }
  onChooseProfileChange(e: any) {
    this.InvestingProfile = +e.target.value;
    if (e.target.value == 0) {
      this.InvestError = true;
    }
    else {
      this.InvestError = false;
    }
  }
  onInsAmt(e: any) {
    this.InvestmentAmount = +e.target.value
    // this.InvestmentAmount = this.currencyPipe.transform(e.target.value)
    if (this.InvestmentAmount == null || this.InvestmentAmount == '') {
      this.InsAmtError = true;
      this.MinimumError = false;
    }
    else if (this.InvestmentAmount < this.MinInvestment) {
      this.MinimumError = true;
      this.InsAmtError = false;
    }
    else {
      this.InsAmtError = false;
      this.MinimumError = false;
    }
  }
  InvestBack(e: any) {
    if (e == 1) {
      this.DiligenceShow = true;
      this.InvestShow = false;
      this.ESignShow = false;
      this.FundInvestmentShow = false;
    }
    if (e == 2) {
      this.DiligenceShow = false;
      this.InvestShow = true;
      this.ESignShow = false;
      this.FundInvestmentShow = false;
    }
    if (e == 3) {
      this.DiligenceShow = false;
      this.InvestShow = false;
      this.ESignShow = true;
      this.FundInvestmentShow = false;
    }
  }
  InvestNext() {
    this.Loader = true;
    if (this.InvestingProfile == 0 || this.InvestmentAmount == null || this.InvestmentAmount == '' || this.InvestmentAmount < this.MinInvestment) {
      if (this.InvestingProfile == 0) {
        this.InvestError = true;
      }
      else {
        this.InvestError = false;
      }
      if (this.InvestmentAmount == null || this.InvestmentAmount == '') {
        this.InsAmtError = true;
        this.MinimumError = false;
      }
      else if (this.InvestmentAmount < this.MinInvestment) {
        this.MinimumError = true;
        this.InsAmtError = false;
      }
      else {
        this.InsAmtError = false;
        this.MinimumError = false;
      }
      this.Loader = false;
    }
    else {
      let invest = {
        Id: this.InvestmentId != 0? this.InvestmentId : 0,
        UserId: this.UserId,
        UserProfileId: this.InvestingProfile,
        OfferingId: this.token,
        Amount: +this.InvestmentAmount,
        Status: 3,
        IsConfirmed: this.InvestorTerms
      }
      if(this.InvestmentId == 0){
        this.investmentService.CreateInvestment(invest).subscribe(data => {
          let x: any = data;
          if (x.statusCode != 0) {
            this.InvestmentId = x.statusCode;
            this.DiligenceShow = false;
            this.InvestShow = false;
            this.ESignShow = true;
            this.FundInvestmentShow = false;
            this.investdone = true;
            this.esignshow = true;
            // this.toastr.success(x.message, 'Success!')
            this.Loader = false;
          }
          else{
            this.toastr.error(x.message, 'Error!')
            this.Loader = false;
          }
        })
      }
      else{
        this.investmentService.UpdateInvestment(invest).subscribe(data => {
          let x: any = data;
          if (x.statusCode != 0) {
            this.InvestmentId = x.statusCode;
            this.DiligenceShow = false;
            this.InvestShow = false;
            this.ESignShow = true;
            this.FundInvestmentShow = false;
            this.investdone = true;
            this.esignshow = true;
            // this.toastr.success(x.message, 'Success!')
            this.Loader = false;
          }
          else{
            this.toastr.error(x.message, 'Error!')
            this.Loader = false;
          }
        })
      }
    }
  }
  EsignNext(){
    this.Loader = true;
    let invest = {
      Id: this.InvestmentId,
      UserId: this.UserId,
      OfferingId: this.token,
      Status: 3,
      IsConfirmed: this.InvestorTerms,
      IseSignCompleted : this.EsignCheckDisabled
    }
    this.investmentService.UpdateInvestment(invest).subscribe(data => {
      let x: any = data;
      if (x.statusCode == 1) {
        this.EsignSkip();
      }
    })
  }

  GetInvestmentByTab() {
    this.investmentService.GetInvestmentDetailsById(this.UserId, this.Offeringtoken).subscribe(data => {
      this.InvestmentTab = data;
      this.InvestorTerms = this.InvestmentTab.isConfirmed
      this.InvestingProfile = this.InvestmentTab.userProfileId
      this.InvestmentAmount = this.InvestmentTab.amount
      this.InvestmentId = this.InvestmentTab.id
      this.StepNavShow =  true;
      if (this.InvestmentTab.isConfirmed == false) {
        this.DiligenceShow = true;
        this.InvestShow = false;
        this.ESignShow = false;
        this.FundInvestmentShow = false;
        this.Loader = false;
      }
      else if (this.InvestmentTab.iseSignCompleted == false && this.OfferingtokenName == 'esign') {
        this.DiligenceShow = false;
        this.InvestShow = false;
        this.ESignShow = true;
        this.FundInvestmentShow = false;
        this.diligencedone = true;
        this.investdone = true;
        this.esignshow = true;
        this.Loader = false;
      }
      else if (this.InvestmentTab.wireTransferDate == null && this.OfferingtokenName == 'fund') {
        this.DiligenceShow = false;
        this.InvestShow = false;
        this.ESignShow = false;
        this.FundInvestmentShow = true;
        this.diligencedone = true;
        this.investdone = true;
        this.esigndone = true;
        this.fundshow = true;
        this.Loader = false;
      }
    })
  }
  EsigncheckValue(e : any){
    // this.EsignCheck = e.target.value
    if (this.EsignCheck == true) {
      this.EsignCheckDisabled = true;
    }
    else {
      this.EsignCheckDisabled = false;
    }
  }
  EsignSkip(){
    this.DiligenceShow = false;
    this.InvestShow = false;
    this.ESignShow = false;
    this.FundInvestmentShow = true;
    this.esigndone = true;
    this.Loader = false
  }
  onFundInvestmentSubmit(){
    this.Loader = true;
    let invest = {
      Id: this.InvestmentId,
      UserId: this.UserId,
      OfferingId: this.token,
      Status: 1,
      IsConfirmed: this.InvestorTerms,
      WireTransferDate : this.WireTransferDate
    }
    this.investmentService.UpdateInvestment(invest).subscribe(data => {
      let x: any = data;
      if (x.statusCode != 0) {
        this.funddone = true;
        this.router.navigate(['./../../myinvestment'], { relativeTo: this.route });
        this.toastr.success(x.message, 'Success!')
        this.Loader = false;
      }
      else{
        this.Loader = false;
      }
    })
  }

  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }
  GetChooseProfile() {
    this.profileService.GetChooseProfile().subscribe(data => {
      this.ChooseProfileValue = data
    })
  }

  GetUserById(){
    this.profileService.GetUserById(this.UserId).subscribe(data =>{
      this.UserData = data;
    })
  }
  onDownloadFile(value: any) {
    var a = document.createElement('a');
    a.href = value.filePath;
    a.download = value.name;
    a.click();
  }

  GetFundingDetails(){
    this.investmentService.GetFundinginstructiondetails(this.token).subscribe(data =>{
      this.FundingDataDetails = data;
    })
  }
  receiveMessage(e : any) {
    this.ProfileValue = [];
      this.ProfileValue.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < e.length; i++) {
        if(e[i].name != null){
          this.ProfileValue.push({ id: e[i].id, name: e[i].name, active: e[i].active })
        }
        else if(e[i].firstName != null){
          this.ProfileValue.push({ id: e[i].id, name: e[i].firstName, active: e[i].active })
        }
        else if(e[i].trustName != null){
          this.ProfileValue.push({ id: e[i].id, name: e[i].trustName, active: e[i].active })
        }
        else if(e[i].retirementPlanName != null){
          this.ProfileValue.push({ id: e[i].id, name: e[i].retirementPlanName, active: e[i].active })
        }
      }
  }

}
