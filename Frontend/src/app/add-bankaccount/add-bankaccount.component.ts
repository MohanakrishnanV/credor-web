import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { InvestorProfileComponent } from '../investor-profile/investor-profile.component';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';

@Component({
  selector: 'app-add-bankaccount',
  templateUrl: './add-bankaccount.component.html',
  styleUrls: ['./add-bankaccount.component.css']
})
export class AddBankaccountComponent implements OnInit {
  @ViewChild(InvestorProfileComponent) investorProfileComponent: any;
  @Input() BankValue: any = [];
  @Output() messageEvent = new EventEmitter<string>();
  BankPopup: boolean = false;
  BankTitleShow: boolean = false;
  BankForm: any;
  BanknameError: boolean = false;
  Accounttype: any = 0;
  AccounttypeError: boolean = false;
  RoutingnumberError: boolean = false;
  RoutingnumberLength: boolean = false;
  showRouting: boolean = false;
  showAccount: boolean = false;
  ConfirmroutingnumberError: boolean = false;
  ConfirmRoutingMatch: boolean = false;
  AccountnumberError: boolean = false;
  ConfirmaccountnumberError: boolean = false;
  ConfirmAccountMatch: boolean = false;
  Loader: boolean = false;
  BankId: any = 0;
  UserId: any;
  BankDetailsData: any = [];
  BankDetails: any = [];
  Confirmaccountnumber: any;
  Accountnumber: any;
  Confirmroutingnumber: any;
  Routingnumber: any;
  Bankname: any;
  RoleId: any;

  constructor(private formbuilder : FormBuilder,
    private profileService: InvestorProfileService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.RoleId = Number(localStorage.getItem('RoleId'))
    if(this.RoleId == 3|| window.name==='Remote'){
      this.UserId = Number(localStorage.getItem('InvestorId'))
    }
    else{
      this.UserId = Number(localStorage.getItem('UserId'))
    }
    this.BankForm = this.formbuilder.group({
      Bankname: ['', Validators.required],
      Accounttype: ['', Validators.required],
      Routingnumber: ['', Validators.required],
      Confirmroutingnumber: ['', Validators.required],
      Accountnumber: ['', Validators.required],
      Confirmaccountnumber: ['', Validators.required],
    })
    this.GetBankDetails();
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
            this.toastr.success("Bank account created successfully","Success!")
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
            this.toastr.success("Bank account updated successfully","Success!")
          }
          else {
            this.toastr.error("Data not saved", 'Error!')
          }
        })
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
  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
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
  Routing() {
    this.showRouting = !this.showRouting;
  }

  Account() {
    this.showAccount = !this.showAccount;
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
  GetBankDetails() {
    this.profileService.GetBankDetails(this.UserId).subscribe(data => {
      this.BankDetails = data;
      this.BankDetailsData = [];
      this.BankDetailsData.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < this.BankDetails.length; i++) {
        this.BankDetailsData.push({ id: this.BankDetails[i].id, name: this.BankDetails[i].bankName + '(' + this.BankDetails[i].accountNumber + ')', active: this.BankDetails[i].active })
      }
      this.messageEvent.emit(this.BankDetails)
      this.Loader = false;
    })
  }
  onBankEdit(e: any) {
    this.BanknameError = false;
    this.AccounttypeError = false;
    this.RoutingnumberError = false;
    this.RoutingnumberLength = false;
    this.ConfirmroutingnumberError = false;
    this.ConfirmRoutingMatch = false;
    this.AccountnumberError = false;
    this.ConfirmaccountnumberError = false;
    this.ConfirmAccountMatch = false;
    this.BankId = e.id
    this.BankPopup = true;
    this.BankTitleShow = true;
    this.BankForm.patchValue({
      Bankname: e.bankName,
      Accounttype: e.accountType,
      Routingnumber: e.routingNumber,
      Confirmroutingnumber: e.routingNumber,
      Accountnumber: e.accountNumber,
      Confirmaccountnumber: e.accountNumber
    })
    this.Accounttype = e.accountType
  }

}
