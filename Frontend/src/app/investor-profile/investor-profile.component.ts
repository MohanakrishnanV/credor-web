import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddBankaccountComponent } from '../add-bankaccount/add-bankaccount.component';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { InvestorProfileService } from './investor-profile.service';

@Component({
  selector: 'app-investor-profile',
  templateUrl: './investor-profile.component.html',
  styleUrls: ['./investor-profile.component.css']
})
export class InvestorProfileComponent implements OnInit {
  @ViewChild(AddBankaccountComponent) addBankAccountComponent: any;
  @ViewChild(AddBankaccountComponent) BankValueData: any = [];
  Bank: any;

  @ViewChild(AddProfileComponent) addProfileComponent : any;
  @ViewChild(AddProfileComponent) ProfileValueData: any = [];
  Profile : any;
  Selected: any;
  ProfileShow: boolean = false;
  BankaccountShow: boolean = false;
  UserId: any;
  ProfileValue: any = [];
  profile: any;
  DeletePopup: boolean = false;
  Bankname: any;
  BankDetails: any = [];
  BankId: any = 0;
  DeleteBankPopup: boolean = false;
  BankDetailsData: any = [];
  UserData: any;
  TotalAmount: any = 0;
  Loader : boolean = false;
  ProfileId: any;
  BankDeleteId: any;

  constructor(private profileService: InvestorProfileService,
    private toastr: ToastrService,
    private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.Loader = true;
    if(window.name==='Remote'){
      this.UserId=Number(localStorage.getItem('InvestorId'))
    }
    else{
      this.UserId = Number(localStorage.getItem('UserId'))
    }
    this.selectProfile();
    this.GetProfile();
    this.GetBankDetails();
    // this.GetUserById();
  }
  selectProfile() {
    this.Selected = 'Profile'
    this.ProfileShow = true;
    this.BankaccountShow = false;
  }
  selectBankaccount() {
    this.Selected = 'BankAccount'
    this.BankaccountShow = true;
    this.ProfileShow = false;
    this.GetBankDetails();
  }

  GetProfile() {
    this.profileService.GetProfileById(this.UserId).subscribe(data => {
      this.ProfileValue = data;
      for(let i = 0; i<this.ProfileValue.length; i++){
        this.TotalAmount = 0;
        let x = this.ProfileValue[i].investments
        for(let j = 0 ; j < x.length; j++){
          this.TotalAmount = this.TotalAmount + x[j].amount
        }
        this.ProfileValue[i].TotalAmount = this.TotalAmount
        this.ProfileValue[i].Length =  x.length
      }
      this.Loader = false;
    })
  }
  onProfileEdit(value: any, e: any) {
    this.addProfileComponent.onProfileEdit(value,e);
  }

  onProfileDelete(value: any) {
    this.ProfileId = value.id
    this.DeletePopup = true;
  }
  onDeleteProfileConfirmation() {
    this.Loader = true;
    this.profileService.DeleteProfile(this.UserId,this.ProfileId).subscribe(data => {
      if (data == 1) {
        this.DeletePopup = false;
        this.GetProfile();
        this.toastr.success('Deleted successfully', 'Success!')
      }
      else{
        this.toastr.error('Cannot be deleted', 'Error!')
        this.Loader = false;
      }
    })
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
  onBankEdit(e: any) {
    this.addBankAccountComponent.onBankEdit(e);
    // this.BanknameError = false;
    // this.AccounttypeError = false;
    // this.RoutingnumberError = false;
    // this.RoutingnumberLength = false;
    // this.ConfirmroutingnumberError = false;
    // this.ConfirmRoutingMatch = false;
    // this.AccountnumberError = false;
    // this.ConfirmaccountnumberError = false;
    // this.ConfirmAccountMatch = false;
    // this.BankId = e.id
    // this.BankPopup = true;
    // this.BankTitleShow = true;
    // this.BankForm.patchValue({
    //   Bankname: e.bankName,
    //   Accounttype: e.accountType,
    //   Routingnumber: e.routingNumber,
    //   Confirmroutingnumber: e.routingNumber,
    //   Accountnumber: e.accountNumber,
    //   Confirmaccountnumber: e.accountNumber
    // })
    // this.Accounttype = e.accountType
  }
  onBankDelete(e: any) {
    this.BankDeleteId = e.id;
    this.DeleteBankPopup = true;
  }
  onDeleteBankConfirmation() {
    this.Loader = true;
    this.profileService.DeleteBank(this.UserId,this.BankDeleteId).subscribe(data => {
      if (data == 1) {
        this.DeleteBankPopup = false;
        this.GetBankDetails();
        this.toastr.success('Bank account deleted successfully', 'Success!')
      }
      else {
        this.toastr.error('Bank account cannot deleted', 'Error!');
        this.Loader = false;
      }
    })
  }
  receiveMessage(e : any) {
    this.ProfileValue = [];
    this.ProfileValue = e;
  }
  BankReturnData(e: any) {
    this.BankDetails = []
    this.BankDetails = e;
  }
}
