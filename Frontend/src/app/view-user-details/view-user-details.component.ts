import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account/account.service';
import { AddInvestmentComponent } from '../add-investment/add-investment.component';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';
import { DistributionService } from '../distributions/distribution.service';
import { DocumentService } from '../documents/document.service';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { InvestorService } from '../investor/investor.service';
import { LeadService } from '../lead/lead.service';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.css']
})
export class ViewUserDetailsComponent implements OnInit {
  @ViewChild(AddReservationComponent) addReservationComponent: any;
  @ViewChild(AddInvestmentComponent) addInvestmentComponent: any;
  @ViewChild(AddProfileComponent) addProfileComponent: any;
  Loader: boolean = false;
  UserView: boolean = false;
  Selected: any;
  ActivityShow: boolean = false;
  NotesShow: boolean = false;
  EmailShow: boolean = false;
  DocsShow: boolean = false;
  DistributionsShow: boolean = false;
  InvestorHeaderSummary: any;
  ReservationData: any;
  InvestorId: any;
  InvestmentData: any;
  InvestorNoteId: any;
  InvestorData: any = [];
  TableView: boolean = false;
  InvestorEmpty: boolean = false;
  InvestorNotes: any;
  NotificationData: any = [];
  Notification: any = [];
  DocumentData: any = [];
  DistributionData: any = [];
  DistributionAmount: any = 0;
  InvestorDataValue: any;
  PortfolioData: any;
  AccountStatementDataValue: any;
  TagDetailsList: any = [];
  UserDetails: any;
  VerifyAccountPopup: boolean = false;
  VerifyAccountBool: boolean = false;
  verifyuser: boolean = false;
  VerifyAccreditPopup: boolean = false;
  VerifyAccreditBool: boolean = false;
  Accreditverifyuser: boolean = false;
  remoteWindow: Window | undefined;
  Residency: any = [];
  LookingInvest: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Less than $10,000' },
    { id: 2, value: '$10,000 to $50,000' },
    { id: 3, value: '$50,000 to $100,000' },
    { id: 4, value: '$100,000 to $250,000' },
    { id: 5, value: 'More than $250,000' },
  ];
  ReservationsShow: boolean = false;
  InvestmentsShow: boolean = false;
  ProfileShow: boolean = false;
  InvestorProfileData: any;
  InvestorProfileDetail: any;
  InvestorsData: any = [];
  AdditionalUserShow: boolean = false;
  AccountAccesstoOther: any = [];
  Profile: any;
  UserId: any;
  WriteNoteBool: boolean = false;
  UpdateInvestorNotes: any;
  InvestorEditNote: boolean = false;
  EditInvestorNoteId: any;
  DeleteDocumentPopup: boolean = false;
  DeleteData: any;
  uploadFile: boolean = false;
  DocumentTypes: any = [];
  DocumentFile: any = [];
  DocSizeBool: boolean = false;
  DocSizeCount: any = 0;
  DocumentTypeId: any = 0;
  NewPassword: any;
  ConfirmNewPassword: any;
  showPassword: boolean = false;
  showConfrimPassword: boolean = false;
  EmptyPassword: boolean = false;
  ValidPassword: boolean = false;
  ValidLowercase: boolean = false;
  ValidUppercase: boolean = false;
  ValidNumbercase: boolean = false;
  ValidSpecialcase: boolean = false;
  ValidLengthcase: boolean = false;
  EmptyConfirmPassword: boolean = false;
  ValidConfirmPassword: boolean = false;
  EmptyCurrentPassword: boolean = false;
  MismatchCurrentPassword: boolean = false;
  UpdatePasswordPopup: boolean = false;

  constructor(private investorService: InvestorService,
    private documentService: DocumentService,
    private distributionService: DistributionService,
    private leadService: LeadService,
    private profileService: InvestorProfileService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.UserId = Number(localStorage.getItem("UserId"));
    this.InvestorId = localStorage.getItem("InvestorId");
    this.GetStateProvince();
    this.GetInvestorById(this.InvestorId);
    this.ViewDetails();
  }

  ViewDetails() {
    this.InvestorId = localStorage.getItem("InvestorId")
    // localStorage.setItem("InvestorId", e.id);
    // localStorage.setItem("I_profileurl", e.profileImageUrl);
    this.Loader = true;
    this.UserView = true;
    this.Activity();
    this.investorService.GetInvestorHeadingSummary(this.InvestorId).subscribe(data => {
      this.InvestorHeaderSummary = data;
      this.Loader = false;
    })
    this.GetInvestorReservationDetais();
    this.GetInvestorInvestmentDetails();
    this.InvestorNoteId = this.InvestorId
    this.GetNoteById();
    this.GetNotification();
    this.GetDocument();
    this.GetDistrubution();

    this.InvestorDataValue = {
      InvestorId: this.InvestorId,
      ModalName: 'Add'
    }

    this.PortfolioData = {
      InvestorId: this.InvestorId,
      ModalName: 'Add'
    }

    this.AccountStatementDataValue = {
      InvestorId: this.InvestorId,
    }
    this.TagDetailsList = [];
  }

  Activity() {
    this.Selected = 'InvestorActivity';
    this.ActivityShow = true;
    this.NotesShow = false;
    this.EmailShow = false;
    this.DocsShow = false;
    this.DistributionsShow = false;
  }

  GetInvestorReservationDetais() {
    this.investorService.GetInvestorReservationDetais(this.InvestorId).subscribe(data => {
      this.ReservationData = data;
    })
  }

  GetInvestorInvestmentDetails() {
    this.investorService.GetInvestorInvestmentDetails(this.InvestorId).subscribe(data => {
      this.InvestmentData = data;
    })
  }

  GetNoteById() {
    this.investorService.GetInvestorNotes(this.InvestorNoteId).subscribe(data => {
      this.InvestorData = data;
      if (this.InvestorData.length > 0) {
        this.TableView = true;
        this.InvestorNotes = ''
      }
      else {
        this.TableView = false;
        this.InvestorEmpty = true;
      }
      this.Loader = false;
    })
  }

  GetNotification() {
    this.accountService.GetNotification(this.InvestorId).subscribe(data => {
      this.NotificationData = data;
      this.Notification = [];
      for (let i = 0; i < 5; i++) {
        this.Notification.push(this.NotificationData[i])
      }
    })
  }

  GetDocument() {
    this.documentService.GetAllDocument(this.InvestorId).subscribe(data => {
      this.DocumentData = data;
      this.Loader = false;
    })
  }

  GetDistrubution() {
    this.distributionService.GetDistributionByUserId(this.InvestorId).subscribe(data => {
      this.DistributionData = data;
      for (let i = 0; i < this.DistributionData.length; i++) {
        this.DistributionAmount = this.DistributionAmount + this.DistributionData[i].amountInvested
      }
    })
  }

  onBack() {
    this.UserView = false;
    let x = localStorage.getItem("RedirectData")
    if (x == "AdminDashboard") {
      this.router.navigate(['./../admin-dashboard'], { relativeTo: this.route });
    }
    localStorage.removeItem("InvestorId");
    localStorage.removeItem("RedirectData");
  }

  onVerifyAccount(e: any) {
    this.VerifyAccountPopup = true;
    this.VerifyAccountBool = e;
    if (this.VerifyAccountBool == true) {
      this.verifyuser = true;
    }
    else {
      this.verifyuser = false;
    }
  }

  onVerifyAccreditation(e: any) {
    this.VerifyAccreditPopup = true;
    this.VerifyAccreditBool = e;
    if (this.VerifyAccreditBool == true) {
      this.Accreditverifyuser = true;
    }
    else {
      this.Accreditverifyuser = false;
    }
  }

  ResetPassword() {
    this.UpdatePasswordPopup = true;
    this.NewPassword = '';
    this.ConfirmNewPassword = '';
    this.showPassword = false;
    this.showConfrimPassword = false;
    this.EmptyCurrentPassword = false;
    this.EmptyPassword = false;
    this.ValidLowercase = false;
    this.ValidUppercase = false;
    this.ValidNumbercase = false;
    this.ValidSpecialcase = false;
    this.ValidLengthcase = false;
    this.MismatchCurrentPassword = false;
    this.EmptyConfirmPassword = false;
    this.ValidConfirmPassword = false;
  }

  onPassword() {
    const validPasswordRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const validateLowercase = /^(?=.*?[a-z])/;
    const validateUppercase = /^(?=.*[A-Z])/;
    const validateNumbercase = /^(?=.*[0-9])/;
    const validateSpecialcase = /^(?=.*[!@#$%^&*])/;
    const validatelengthcase = /^(?=.{12,})/;
    if (this.NewPassword == null || this.NewPassword == ' ' || this.NewPassword == '') {
      this.EmptyPassword = true;
      this.MismatchCurrentPassword = false;
      this.ValidLowercase = false;
      this.ValidUppercase = false;
      this.ValidNumbercase = false;
      this.ValidSpecialcase = false;
      this.ValidLengthcase = false;
    }
    else {
      this.EmptyPassword = false;
      this.MismatchCurrentPassword = false;
      if (validateLowercase.test(this.NewPassword)) {
        this.ValidLowercase = false;
      }
      else {
        this.ValidLowercase = true;
      }
      if (validateUppercase.test(this.NewPassword)) {
        this.ValidUppercase = false;
      } else {
        this.ValidUppercase = true;
      }
      if (validateNumbercase.test(this.NewPassword)) {
        this.ValidNumbercase = false;
      } else {
        this.ValidNumbercase = true;
      }
      if (validateSpecialcase.test(this.NewPassword)) {
        this.ValidSpecialcase = false;
      } else {
        this.ValidSpecialcase = true;
      }
      if (validatelengthcase.test(this.NewPassword)) {
        this.ValidLengthcase = false;
      } else {
        this.ValidLengthcase = true;
      }
    }
  }

  Password() {
    this.showPassword = !this.showPassword;
  }

  ConfirmPassword() {
    this.showConfrimPassword = !this.showConfrimPassword;
  }

  onConfirmPassword() {
    if (this.ConfirmNewPassword == '') {
      this.EmptyConfirmPassword = true;
    }
    else {
      this.EmptyConfirmPassword = false;
      if (this.NewPassword == this.ConfirmNewPassword) {
        this.ValidConfirmPassword = false;
      }
      else {
        this.ValidConfirmPassword = true;
      }
    }
  }

  onUpdatePassword() {
    this.Loader = true;
    if (this.NewPassword == '' || this.ConfirmNewPassword == '' || this.ValidLowercase == true
      || this.ValidUppercase == true || this.ValidNumbercase == true || this.ValidSpecialcase == true || this.ValidLengthcase == true
      || this.MismatchCurrentPassword == true || this.ValidConfirmPassword == true || this.EmptyConfirmPassword == true) {
      this.onPassword();
      this.onConfirmPassword();
      this.Loader = false;
    }
    else {
      let password = {
        AdminUserId: this.UserId,
        UserId: this.UserDetails.id,
        Password: this.NewPassword
      }
      this.investorService.ResetPassword(password).subscribe(data => {
        if (data == true) {
          this.Loader = false;
          this.UpdatePasswordPopup = false;
          this.toastr.success("Password reseted successfully", "Success!");
        }
        else {
          this.Loader = false;
          this.toastr.error("Can't reset the password", "Error!");
        }
      })
    }
  }

  GetResetPasswordLink() {
    this.Loader = true;
    let password = {
      AdminUserId: this.UserId,
      UserId: this.UserDetails.id,
    }
    this.investorService.ResetPasswordLink(password).subscribe(data => {
      if (data == true) {
        this.Loader = false;
        this.UpdatePasswordPopup = false;
        this.toastr.success("Password link sent successfully", "Success!");
      }
      else {
        this.Loader = false;
        this.toastr.error("Can't reset the password", "Error!");
      }
    })
  }

  EditProfile() {

  }

  rModeToInvestor() {
    if (this.remoteWindow) {
      this.remoteWindow.close();
    }
    let windowOrigin = window.location.origin;
    let windowControl = 'location=yes,width=' + screen.availWidth + ', height = ' + screen.availHeight
      + ', scrollbars = yes, status = yes';
    window.open(windowOrigin + "/myinvestment", 'Remote', windowControl);
  }

  Reservations() {
    this.ReservationsShow = !this.ReservationsShow;
    this.GetInvestorReservationDetais();
  }

  onEditReservation(val: any) {
    this.addReservationComponent.EditReservation(val, 'investor')
  }

  receiveMessage1(e: any) {
    this.GetInvestorReservationDetais();
  }

  Investments() {
    this.InvestmentsShow = !this.InvestmentsShow;
  }

  onEditInvestment(val: any) {
    this.addInvestmentComponent.EditInvestment(val, 'Edit')
  }

  receiveMessage2(e: any) {
    this.GetInvestorInvestmentDetails();
  }

  Profiles() {
    this.ProfileShow = !this.ProfileShow;
    this.GetInvestorProfiles();
  }

  GetInvestorProfiles() {
    this.investorService.GetInvestorProfiles(this.InvestorId).subscribe(data => {
      this.InvestorProfileData = data;
      this.InvestorProfileData.details = null;
      this.InvestorProfileDetail = [];
      this.InvestorProfileDetail = this.InvestorProfileData;
      this.InvestorProfileData.forEach((element: any) => {
        this.InvestorProfileDetail.push({
          id: element.Id,
          profileName: this.GetProfileNamebyType(element),
          name: element.name,
          inCareOf: element.inCareOf,
          streetAddress1: element.streetAddress1,
          streetAddress2: element.streetAddress2,
          stateOrProvinceId: element.stateOrProvinceId,
          type: element.type,
          typeName: element.typeName,
          profileDisplayId: element.profileDisplayId,
          address: element.streetAddress1 + ' ' + element.streetAddress2,
          city: element.city,
          country: element.country,
          state: (element.stateOrProvinceId == 0 ? element.state : this.GetStateOrProvinceName(element.stateOrProvinceId)),
          zipCode: element.zipCode,
          taxId: element.taxId,
          isDisregardedEntity: element.isDisregardedEntity,
          isIRALLC: element.isIRALLC,
          taxIdofOwner: element.OwnerTaxId,
          distributionTypeId: element.distributionTypeId == null ? 0 : element.distributionTypeId,
          paymentMethod: element.paymentMethod,
          bankName: element.bankName,
          bankAccountType: element.bankAccountType,
          bankRoutingNumber: element.bankRoutingNumber,
          bankAccountNumber: element.bankAccountNumber,
          bankAccountId: element.bankAccountId,
          checkInCareOf: element.checkInCareOf,
          checkAddressLine1: element.checkAddressLine1,
          checkAddressLine2: element.checkAddressLine2,
          checkAddress: element.checkAddressLine1 + ' ' + element.checkAddressLine2,
          checkCity: element.checkCity,
          checkState: (element.checkStateId == 0 ? '' : this.GetStateOrProvinceName(element.checkStateId)),
          checkStateId: element.checkStateId,
          checkZip: element.checkZip,
          otherDetails: element.distributionDetail,
        });
      });
    })
  }

  GetProfileNamebyType(profile: any) {
    switch (profile.type) {
      case 1: {
        return profile.name;
        break;
      }
      case 2: {
        return profile.name;
        break;
      }
      case 3: {
        return profile.firstName + ' ' + profile.lastName;
        break;
      }
      case 4: {
        return profile.trustName;
        break;
      }
      case 5: {
        return profile.name;
        break;
      }
      case 6: {
        return profile.retirementPlanName;
        break;
      }
      default: {
        return profile.name;
        break;
      }
    }
  }

  GetStateOrProvinceName(id: any) {
    if (id != 0) {
      var residency = this.Residency.filter((x: { id: any; }) => x.id == id);
      return residency[0].name;
    }
    else
      return '-';
  }

  OnViewProfile(profile: any) {
    var profileId = profile.id;
    var profileName = this.GetProfileNamebyType(profile);
    this.InvestorProfileDetail = [];
    this.InvestorProfileData.forEach((element: any) => {
      this.InvestorProfileDetail.push({
        id: element.id,
        profileName: this.GetProfileNamebyType(element),
        name: element.name,
        inCareOf: element.inCareOf,
        streetAddress1: element.streetAddress1,
        streetAddress2: element.streetAddress2,
        stateOrProvinceId: element.stateOrProvinceId,
        type: element.type,
        typeName: element.typeName,
        profileDisplayId: element.profileDisplayId,
        address: element.streetAddress1 + ' ' + element.streetAddress2,
        city: element.city,
        country: element.country,
        state: (element.stateOrProvinceId == 0 ? element.state : this.GetStateOrProvinceName(element.stateOrProvinceId)),
        zipCode: element.zipCode,
        taxId: element.taxId,
        isDisregardedEntity: element.isDisregardedEntity,
        isIRALLC: element.isIRALLC,
        taxIdofOwner: element.OwnerTaxId,
        showProfileDetail: element.id == profile.id ? true : false,
        distributionTypeId: element.distributionTypeId == null ? 0 : element.distributionTypeId,
        paymentMethod: element.paymentMethod,
        bankName: element.bankName,
        bankAccountType: element.bankAccountType,
        bankRoutingNumber: element.bankRoutingNumber,
        bankAccountNumber: element.bankAccountNumber,
        bankAccountId: element.bankAccountId,
        checkInCareOf: element.checkInCareOf,
        checkAddressLine1: element.checkAddressLine1,
        checkAddressLine2: element.checkAddressLine2,
        checkAddress: element.checkAddressLine1 + ' ' + element.checkAddressLine2,
        checkCity: element.checkCity,
        checkState: (element.checkStateId == 0 ? '' : this.GetStateOrProvinceName(element.checkStateId)),
        checkStateId: element.checkStateId,
        checkZip: element.checkZip,
        otherDetails: element.distributionDetail,
      });
    });
    this.InvestorsData = this.InvestorProfileData.filter((x: { id: any; }) => x.id == profileId)[0].investors;
  }

  OnCancelProfile(profile: any) {
    var profileName = this.GetProfileNamebyType(profile);
    this.InvestorProfileDetail = [];
  }

  OnEditProfile(value: any, e: any) {
    this.addProfileComponent.onProfileEdit(value, e);
  }

  AdditionalUser() {
    this.AdditionalUserShow = !this.AdditionalUserShow;
    this.GetAccountAccesstoOthers();
  }

  GetAccountAccesstoOthers() {
    this.accountService.GetAccountAccesstoOthers(this.InvestorId).subscribe(data => {
      this.AccountAccesstoOther = data;
    })
  }

  receiveMessage(e: any) {
    this.GetInvestorProfiles();
  }

  Distrubutions() {
    this.Selected = 'InvestorDistributions';
    this.ActivityShow = false;
    this.NotesShow = false;
    this.EmailShow = false;
    this.DocsShow = false;
    this.DistributionsShow = true;
  }

  Notes() {
    this.Selected = 'InvestorNotes';
    this.ActivityShow = false;
    this.NotesShow = true;
    this.EmailShow = false;
    this.DocsShow = false;
    this.DistributionsShow = false;
    this.InvestorNotes = ''
  }

  Email() {
    this.Selected = 'InvestorEmail';
    this.ActivityShow = false;
    this.NotesShow = false;
    this.EmailShow = true;
    this.DocsShow = false;
    this.DistributionsShow = false;
  }

  Docs() {
    this.Selected = 'InvestorDocs';
    this.ActivityShow = false;
    this.NotesShow = false;
    this.EmailShow = false;
    this.DocsShow = true;
    this.DistributionsShow = false;
  }

  onLoadMore() {
    let length = this.Notification.length + 5
    for (let i = this.Notification.length; i < length; i++) {
      if (this.NotificationData[i] != null) {
        this.Notification.push(this.NotificationData[i])
      }
    }
  }

  OnCancelNotes() {
    this.InvestorNotes = '';
  }

  InvestorSaveNotes() {
    this.Loader = true;
    let notes = {
      Id: 0,
      AdminUserId: this.UserId,
      UserId: this.InvestorNoteId,
      Notes: this.InvestorNotes,
      Active: true
    }
    this.investorService.AddInvestorNotes(notes).subscribe(data => {
      if (data == true) {
        this.WriteNoteBool = false;
        this.GetNoteById();
      }
      else {
        this.Loader = false;
      }
    })
  }

  EditNoteInvestor(e: any) {
    this.UpdateInvestorNotes = e.notes;
    this.InvestorEditNote = true;
    this.EditInvestorNoteId = e.id
  }

  DeleteNote(e: any) {
    this.Loader = true;
    this.investorService.DeleteInvestorNotes(this.UserId, e.id).subscribe(data => {
      if (data == true) {
        this.WriteNoteBool = false;
        this.GetNoteById();
      }
      else {
        this.Loader = false;
      }
    })
  }

  InvestorUpdateNote() {
    this.Loader = true;
    let notes = {
      Id: this.EditInvestorNoteId != 0 ? this.EditInvestorNoteId : 0,
      AdminUserId: this.UserId,
      UserId: this.InvestorNoteId,
      Notes: this.UpdateInvestorNotes,
      Active: true
    }
    this.investorService.UpdateInvestorNotes(notes).subscribe(data => {
      if (data == true) {
        this.WriteNoteBool = false;
        this.InvestorEditNote = false;
        this.GetNoteById();
        this.InvestorNotes = '';
      }
      else {
        this.Loader = false;
      }
    })
  }

  onDownloadFile(value: any, name: any) {
    var a = document.createElement('a');
    if (name == 'InvestorDoc') {
      a.href = value.filePath;
    }
    else {
      a.href = value.documentPath;
    }
    a.download = value.name;
    a.click();
  }

  OnDelete(val: any) {
    this.DeleteData = val;
    this.DeleteDocumentPopup = true;
  }

  UploadDocument() {
    this.GetDocumentTypes();
    this.uploadFile = true;
    this.DocumentFile = [];
    this.DocSizeBool = false;
    this.DocSizeCount = 0;
    this.DocumentTypeId = 0;
  }

  GetDocumentTypes() {
    this.DocumentTypes = [];
    this.investorService.GetDocumentTypes().subscribe(data => {
      let x: any = data
      this.DocumentTypes.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.DocumentTypes.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }

  CancelVerifyAccount() {
    this.VerifyAccountPopup = false;
    this.UserDetails.verifyAccount = !this.VerifyAccountBool
  }

  onSaveVerifyAccount() {
    this.Loader = true;
    this.leadService.VerifyAccount(this.UserId, this.UserDetails.id, this.VerifyAccountBool).subscribe(data => {
      if (data == true) {
        this.VerifyAccountPopup = false;
        this.GetInvestorById(this.UserDetails.id);
      }
      else {
        this.VerifyAccountPopup = false;
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

  GetInvestorById(id: any) {
    this.leadService.GetUserId(id).subscribe(data => {
      this.UserDetails = data;
      console.log(this.UserDetails, 'userdetails')
      this.Loader = false
    })
  }

}
