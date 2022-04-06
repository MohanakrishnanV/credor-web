import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account/account.service';
import { HeaderComponent } from '../header/header.component';
import { LoginService } from '../login/login.service';
import { SettingsService } from './settings.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild(HeaderComponent) headerComponent: any;
  ProfileImageData: any;
  Selected: any;
  MyAccountShow: boolean = false;
  CompanyUsersShow: boolean = false;
  UserNotificationShow: boolean = false;
  filesToUpload: any = [];
  ProfileImage: any = [];
  allowedFileExtensions: any = [];
  UserData: any;
  UserId: any;
  AccountForm: any;
  FirstnameError: boolean = false;
  LastnameError: boolean = false;
  UserDetails: any = [];
  PhoneError: boolean = false;
  PhoneVerify: boolean = false;
  PhoneExists: boolean = false;
  EmailError: boolean = false;
  EmailVerify: boolean = false;
  EmailExists: boolean = false;
  Loader: boolean = false;
  Getotp: any;
  OtpPopup: boolean = false;
  PhoneOtpPopup: boolean = false;
  InvestorData: any;
  TwoFactor: boolean = false;
  OtpEmail: any;
  VerifyEmailDisabled: boolean = false;
  OtpPhone: any;
  VerifyPhoneDisabled: boolean = false;
  UpdatePasswordPopup: boolean = false;
  CurrentPassword: any;
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
  AdminUserList: any = [];
  RoleId: any;
  AddAdminUserPopup: boolean = false;
  AdminUserForm: any;
  AdminFirstnameError: boolean = false;
  AdminLastnameError: boolean = false;
  AdminPhoneError: boolean = false;
  AdminPhoneExists: boolean = false;
  AdminEmailError: boolean = false;
  AdminEmailExists: boolean = false;
  AdminTitleError: boolean = false;
  AdminUserId: any = 0;
  AdminUserDeleteConfirmationPopup: boolean = false;
  AdminTwoFactor: any;
  AdminAccountStatusPopup: boolean = false;
  AdminAccountEnable: boolean = false;
  RoleFeatureMapping: any = [];
  SelectAllChecked: any;
  AdminOwnerAccountPopup: boolean = false;
  AdminNotificationShow: boolean = false;
  EmailTemplate: any = [];
  AdminEmailTemplate: any = [];
  UserEmailTemplate: any = [];
  EmailSubject: any;
  Editor: any = {};
  EmailContent: any;
  EmailTemplateId: any = 0;
  EmailTemplateActiveInactivePopup: boolean = false;
  EmailTemplateEnable: boolean = false;
  PreviewEmailPopup: boolean = false;
  PrivacyPolicyShow: boolean = true;
  TermsAndConditionsShow: boolean = false;
  CredorInfoList: any = [];
  PrivacyPolicy: any = [];
  TermsandCondition: any = [];
  CredorInfoId: any;

  constructor(private accountService: AccountService,
    private loginService: LoginService,
    private settingService: SettingsService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService) {
    this.Editor = InlineEditor;
  }

  ngOnInit(): void {
    this.Loader = true;
    this.AccountForm = this.formbuilder.group({
      FirstName: [''],
      LastName: [''],
      Phone: [''],
      Email: [''],
      SecondaryEmail: [''],
      ReceiveEmail: [''],
      DOB: [''],
      TwoFactor: [''],
      NewsletterUpdate: [''],
      InvestmentAnnouncements: [''],
    })
    this.AdminUserForm = this.formbuilder.group({
      FirstName: [''],
      LastName: [''],
      Phone: [''],
      Email: [''],
      Title: [''],
    })
    this.allowedFileExtensions = ['jpg', 'jpeg', 'png', 'PNG'];
    this.RoleId = Number(localStorage.getItem('RoleId'));
    this.UserId = Number(localStorage.getItem('UserId'));
    this.onMyAccount();
    this.GetProfile();
    this.GetAdminUsers();
    this.GetRoleFeatureMapping();
    this.GetEmailTemplate();
    this.GetCredorInfo();
  }

  onMyAccount() {
    this.Selected = 'MyAccount';
    this.MyAccountShow = true;
    this.CompanyUsersShow = false;
    this.UserNotificationShow = false;
    this.AdminNotificationShow = false;
    this.PrivacyPolicyShow = false;
    this.TermsAndConditionsShow = false;
  }

  onCompanyUsers() {
    this.Selected = 'CompanyUsers';
    this.CompanyUsersShow = true;
    this.MyAccountShow = false;
    this.UserNotificationShow = false;
    this.AdminNotificationShow = false;
    this.PrivacyPolicyShow = false;
    this.TermsAndConditionsShow = false;
  }

  onAdminNotifications() {
    this.Selected = 'AdminNotifications';
    this.AdminNotificationShow = true;
    this.CompanyUsersShow = false;
    this.MyAccountShow = false;
    this.UserNotificationShow = false;
    this.PrivacyPolicyShow = false;
    this.TermsAndConditionsShow = false;
    this.EmailTemplateId = this.AdminEmailTemplate[0].id
    this.EmailSubject = this.AdminEmailTemplate[0].subject
    this.EmailContent = this.AdminEmailTemplate[0].bodyContent
  }

  onUserNotification() {
    this.Selected = 'UserNotifications';
    this.UserNotificationShow = true;
    this.CompanyUsersShow = false;
    this.MyAccountShow = false;
    this.AdminNotificationShow = false;
    this.PrivacyPolicyShow = false;
    this.TermsAndConditionsShow = false;
    this.EmailTemplateId = this.UserEmailTemplate[0].id
    this.EmailSubject = this.UserEmailTemplate[0].subject
    this.EmailContent = this.UserEmailTemplate[0].bodyContent
  }

  onPrivacyPolicy() {
    this.Selected = 'PrivacyPolicy';
    this.PrivacyPolicyShow = true;
    this.UserNotificationShow = false;
    this.CompanyUsersShow = false;
    this.MyAccountShow = false;
    this.AdminNotificationShow = false;
    this.TermsAndConditionsShow = false;
    this.CredorInfoId = this.PrivacyPolicy[0].id;
    this.EmailSubject = this.PrivacyPolicy[0].templateName
    this.EmailContent = this.PrivacyPolicy[0].bodyContent;
  }

  onTermsAndConditions() {
    this.Selected = 'TermsAndConditions';
    this.TermsAndConditionsShow = true;
    this.PrivacyPolicyShow = false;
    this.UserNotificationShow = false;
    this.CompanyUsersShow = false;
    this.MyAccountShow = false;
    this.AdminNotificationShow = false;
    this.CredorInfoId = this.TermsandCondition[0].id;
    this.EmailSubject = this.TermsandCondition[0].templateName
    this.EmailContent = this.TermsandCondition[0].bodyContent;
  }

  uploadFile(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      let ext: any;
      this.filesToUpload = [];
      this.allowedFileExtensions.forEach((element: any) => {
        if (element == event.target.files[i].name.split('.').pop()) {
          this.filesToUpload.push(event.target.files[i]);
          if (this.filesToUpload.length > 0) {
            this.UserData.profileImageUrl = ''
          }
          ext = null;
          ext = event.target.files[i].name.split('.').pop();
          const file = event.target.files[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          if (event.target.files[i].type == 'image/jpeg' || event.target.files[i].type == 'image/png' || event.target.files[i].type == 'image/PNG' || event.target.files[i].type == 'image/jpg' || event.target.files[i].type == 'image/JPEG') {
            reader.onload = () => {
              this.ProfileImage = [];
              this.ProfileImage.push({ profileImageUrl: reader.result, CoverFileType: 'jpeg' });
            };
          }
        }
      });
      if (ext == null) {
        this.toastr.error(event.target.files[i].name.split('.').pop() + ' files are not accepted.', 'Error');
      }
    }
  }

  GetProfile() {
    this.accountService.GetProfile(this.UserId).subscribe(data => {
      this.UserData = data;
      console.log(this.UserData, 'userdata')
      localStorage.removeItem("ProfileImg");
      localStorage.setItem('ProfileImg', this.UserData.profileImageUrl)
      this.AccountForm.patchValue({
        FirstName: this.UserData.firstName,
        LastName: this.UserData.lastName,
        Phone: this.UserData.phoneNumber,
        Email: this.UserData.emailId,
        DOB: this.UserData.dateOfBirth,
        TwoFactor: this.UserData.isTwoFactorAuthEnabled,
      })
      this.ProfileImage.push({ profileImageUrl: this.UserData.profileImageUrl });
      this.ProfileImageData = this.UserData.profileImageUrl;
      // this.headerComponent.ProfileImageUpdate(this.UserData.profileImageUrl);
      if (this.UserData.isEmailVerified == true) {
        this.EmailVerify = true;
      }
      else {
        this.EmailVerify = false
      }
      if (this.UserData.isPhoneVerified == true) {
        this.PhoneVerify = true;
      }
      else {
        this.PhoneVerify = false;
      }
      this.GetUser();
      this.Loader = false;
    })
  }

  onChangePassword() {
    this.UpdatePasswordPopup = true;
    this.CurrentPassword = '';
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

  onFirstName() {
    if (this.AccountForm.value.FirstName == '' || this.AccountForm.value.FirstName == null) {
      this.FirstnameError = true;
    }
    else {
      this.FirstnameError = false;
    }
  }

  onLastName() {
    if (this.AccountForm.value.LastName == '' || this.AccountForm.value.LastName == null) {
      this.LastnameError = true;
    }
    else {
      this.LastnameError = false;
    }
  }

  onPhone() {
    let x = this.UserDetails.filter((x: { phoneNumber: any; }) => x.phoneNumber == this.AccountForm.value.Phone)
    if (this.AccountForm.value.Phone == '' || this.AccountForm.value.Phone == null) {
      this.PhoneError = true;
      this.PhoneVerify = false;
      this.PhoneExists = false;
    }
    else if (this.AccountForm.value.Phone == this.UserData.phoneNumber) {
      this.PhoneVerify = true;
      this.PhoneError = false;
      this.PhoneExists = false;
    }
    else if (x.length > 0) {
      this.PhoneExists = true;
      this.PhoneError = false;
      this.PhoneVerify = false;
    }
    else {
      this.PhoneError = false;
      this.PhoneVerify = false;
      this.PhoneExists = false;
    }
  }

  onEmail() {
    let x = this.UserDetails.filter((x: { emailId: any; }) => x.emailId == this.AccountForm.value.Email)
    if (this.AccountForm.value.Email == '' || this.AccountForm.value.Email == null) {
      this.EmailError = true;
      this.EmailVerify = false;
      this.EmailExists = false;
    }
    else if (this.AccountForm.value.Email == this.UserData.emailId) {
      this.EmailError = false;
      this.EmailVerify = true;
      this.EmailExists = false;
    }
    else if (x.length > 0) {
      this.EmailError = false;
      this.EmailVerify = false;
      this.EmailExists = true;
    }
    else {
      this.EmailError = false;
      this.EmailVerify = false;
      this.EmailExists = false;
    }
  }

  GetUser() {
    this.loginService.GetUser().subscribe(data => {
      this.UserDetails = data;
      console.log(this.UserDetails, 'userdetails')
    })
  }

  onVerifyEmail(e: any) {
    this.Loader = true;
    if (e == "Phone") {
      this.Getotp = {
        Id: this.UserId,
        PhoneNumber: this.AccountForm.value.Phone
      }
    }
    else if (e == "Email") {
      this.Getotp = {
        Id: this.UserId,
        EmailId: this.AccountForm.value.Email
      }
    }
    this.accountService.SendOtp(this.Getotp).subscribe(data => {
      console.log(data, 'otp')
      if (data == true) {
        if (e == "Email") {
          this.OtpPopup = true;
          this.toastr.success("OTP send your respective emailid", 'Success!')
        }
        else if (e == "Phone") {
          this.PhoneOtpPopup = true;
          this.toastr.success("OTP send your respective phone number", 'Success!')
        }
        this.Loader = false
      }
      else {
        this.Loader = false;
        if (e == "Phone") {
          this.toastr.info("Otp can't send for this phone number", "Info!")
        }
        if (e == "Email") {
          this.toastr.info("Otp can't send for this email", "Info!")
        }
      }
    })
  }

  SaveProfile() {
    this.Loader = true;
    if (this.AccountForm.value.FirstName == '' || this.AccountForm.value.FirstName == null
      || this.AccountForm.value.LastName == '' || this.AccountForm.value.LastName == null || this.EmailExists == true
      || this.AccountForm.value.Phone == '' || this.AccountForm.value.Phone == null
      || this.AccountForm.value.Email == '' || this.AccountForm.value.Email == null || this.PhoneExists == true) {
      this.onFirstName();
      this.onLastName();
      this.onPhone();
      this.onEmail();
      this.Loader = false;
    }
    else {
      const ProfileImg = new FormData();
      ProfileImg.append("Id", this.UserData.id);
      ProfileImg.append("FirstName", this.AccountForm.value.FirstName);
      ProfileImg.append("LastName", this.AccountForm.value.LastName);
      ProfileImg.append("EmailId", this.AccountForm.value.Email);
      ProfileImg.append("PhoneNumber", this.AccountForm.value.Phone);
      ProfileImg.append("IsEmailVerified", this.UserData.isEmailVerified);
      ProfileImg.append("IsPhoneVerified", this.UserData.isPhoneVerified);
      ProfileImg.append("DateOfBirth", this.AccountForm.value.DOB);
      ProfileImg.append("IsTwoFactorAuthEnabled", this.AccountForm.value.TwoFactor);
      ProfileImg.append("ProfileImageUrl", this.UserData.profileImageUrl != '' ? this.UserData.profileImageUrl : '');
      this.filesToUpload.forEach((item: string | Blob) => {
        ProfileImg.append('profileImage', item);
      });
      this.settingService.UpdateAdminAccount(ProfileImg).subscribe(data => {
        if (data == 1) {
          this.GetProfile();
          this.toastr.success("Profile updated Successfully", "Success!")
        }
        else {
          this.Loader = false;
        }
      })
    }
  }

  onTwoFactor(e: any) {
    if (this.AccountForm.value.TwoFactor == true) {
      this.TwoFactor = true;
    }
    else {
      this.TwoFactor = false;
    }
  }

  onOtpChange(e: any) {
    this.OtpEmail = e;
    if (this.OtpEmail == '' || this.OtpEmail == null) {
      this.VerifyEmailDisabled = true;
    }
    else if (this.OtpEmail.length == 6) {
      this.VerifyEmailDisabled = false;
    }
    else {
      this.VerifyEmailDisabled = false;
    }
  }

  ResetOtpEmail(e: any) {
    this.Loader = true;
    if (e == "Phone") {
      this.Getotp = {
        Id: this.UserId,
        PhoneNumber: this.AccountForm.value.Phone
      }
    }
    else if (e == "Email") {
      this.Getotp = {
        Id: this.UserId,
        EmailId: this.AccountForm.value.Email
      }
    }
    this.accountService.ResendOtp(this.Getotp).subscribe(data => {
      console.log(data, 'otp')
      if (data == true) {
        if (e == "Email") {
          this.OtpPopup = true;
        }
        else if (e == "Phone") {
          this.PhoneOtpPopup = true;
        }
        this.toastr.success("OTP resent successfully", "Success!")
        this.Loader = false;
      }
      else {
        this.Loader = false;
        this.toastr.info("Can't resent otp", "Info!")
      }
    })
  }

  onOtpPhoneChange(e: any) {
    this.OtpPhone = e;
    if (this.OtpPhone == '' || this.OtpPhone == null) {
      this.VerifyPhoneDisabled = true;
    }
    else if (this.OtpPhone.length == 6) {
      this.VerifyPhoneDisabled = false;
    }
    else {
      this.VerifyPhoneDisabled = false;
    }
  }

  VerifyOtpEmail() {
    this.Loader = true;
    if (this.OtpEmail == null || this.OtpEmail == '') {
      this.toastr.info("Please enter the OTP", "Info!");
      this.VerifyEmailDisabled = true;
      this.Loader = false;
    }
    else if (this.OtpEmail.length != 6) {
      this.toastr.info("Enter a valid OTP", "Info!");
      this.VerifyEmailDisabled = true;
      this.Loader = false;
    }
    else {
      let otpVerify = {
        Id: this.UserId,
        OneTimePassword: this.OtpEmail,
        EmailId: this.AccountForm.value.Email
      }
      this.accountService.VerifyEmail(otpVerify).subscribe(data => {
        if (data == true) {
          this.OtpPopup = false;
          this.GetProfile();
          this.toastr.success("Email verified successfully", "Success!")
        }
        else {
          this.Loader = false;
          this.OtpPopup = false;
          this.toastr.error("Invalid OTP", "Error!")
        }
      })
    }
  }

  VerifyOtpPhone() {
    this.Loader = true;
    if (this.OtpPhone == null || this.OtpPhone == '') {
      this.toastr.info("Please enter the OTP", "Info!");
      this.VerifyPhoneDisabled = true;
      this.Loader = false;
    }
    else if (this.OtpPhone.length != 6) {
      this.toastr.info("Enter a valid OTP", "Info!");
      this.VerifyPhoneDisabled = true;
      this.Loader = false;
    }
    else {
      let otpPhoneVerify = {
        Id: this.UserId,
        OneTimePassword: this.OtpPhone,
        PhoneNumber: this.AccountForm.value.Phone
      }
      this.accountService.VerifyPhone(otpPhoneVerify).subscribe(data => {
        if (data == true) {
          this.PhoneOtpPopup = false;
          this.GetProfile();
          this.toastr.success("Phone number verified successfully", "Success!")
        }
        else {
          this.Loader = false;
          this.PhoneOtpPopup = false;
          this.toastr.error("Invalid OTP", "Error!")
        }
      })
    }
  }

  onCurrentPassword() {
    if (this.CurrentPassword == '' || this.CurrentPassword == null) {
      this.EmptyCurrentPassword = true;
    }
    else {
      this.EmptyCurrentPassword = false;
    }
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
    else if (this.NewPassword == this.CurrentPassword) {
      this.MismatchCurrentPassword = true;
      this.EmptyPassword = false;
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
    if (this.CurrentPassword == '' || this.NewPassword == '' || this.ConfirmNewPassword == '' || this.ValidLowercase == true
      || this.ValidUppercase == true || this.ValidNumbercase == true || this.ValidSpecialcase == true || this.ValidLengthcase == true
      || this.MismatchCurrentPassword == true || this.ValidConfirmPassword == true || this.EmptyConfirmPassword == true) {
      this.onCurrentPassword();
      this.onPassword();
      this.onConfirmPassword();
      this.Loader = false;
    }
    else {
      let password = {
        UserId: this.UserId,
        OldPassword: this.CurrentPassword,
        NewPassword: this.NewPassword
      }
      this.accountService.UpdatePassword(password).subscribe(data => {
        if (data == 0) {
          this.UpdatePasswordPopup = false;
          this.GetProfile();
          this.toastr.success("Password updated successfully", "Success!");
        }
        else {
          this.Loader = false;
          this.UpdatePasswordPopup = false;
          this.toastr.error("Invalid password", "Error!");
        }
      })
    }
  }

  GetAdminUsers() {
    this.settingService.GetAdminUser(this.RoleId).subscribe(data => {
      this.AdminUserList = data;
      console.log(this.AdminUserList, 'adminuserlist')
      this.Loader = false;
    })
  }

  onAddAdminUser() {
    this.Loader = true;
    this.AdminUserId = 0;
    this.AddAdminUserPopup = true;
    this.AdminUserForm.reset();
    this.AdminFirstnameError = false;
    this.AdminLastnameError = false;
    this.AdminPhoneError = false;
    this.AdminPhoneExists = false;
    this.AdminEmailError = false;
    this.AdminEmailExists = false;
    this.AdminTitleError = false;
    this.GetRoleFeatureMapping();
  }

  onAdminFirstName() {
    if (this.AdminUserForm.value.FirstName == '' || this.AdminUserForm.value.FirstName == null) {
      this.AdminFirstnameError = true;
    }
    else {
      this.AdminFirstnameError = false;
    }
  }

  onAdminLastName() {
    if (this.AdminUserForm.value.LastName == '' || this.AdminUserForm.value.LastName == null) {
      this.AdminLastnameError = true;
    }
    else {
      this.AdminLastnameError = false;
    }
  }

  onAdminPhone() {
    let x = this.UserDetails.filter((x: { phoneNumber: any; }) => x.phoneNumber == this.AdminUserForm.value.Phone)
    if (this.AdminUserForm.value.Phone == '' || this.AdminUserForm.value.Phone == null) {
      this.AdminPhoneError = true;
      this.AdminPhoneExists = false;
    }
    else if (x.length > 0) {
      this.AdminPhoneExists = true;
      this.AdminPhoneError = false;
    }
    else {
      this.AdminPhoneError = false;
      this.AdminPhoneExists = false;
    }
  }

  onAdminEmail() {
    let x = this.UserDetails.filter((x: { emailId: any; }) => x.emailId == this.AdminUserForm.value.Email)
    if (this.AdminUserForm.value.Email == '' || this.AdminUserForm.value.Email == null) {
      this.AdminEmailError = true;
      this.AdminEmailExists = false;
    }
    else if (x.length > 0) {
      this.AdminEmailError = false;
      this.AdminEmailExists = true;
    }
    else {
      this.AdminEmailError = false;
      this.AdminEmailExists = false;
    }
  }

  onAdminTitle() {
    if (this.AdminUserForm.value.Title == '' || this.AdminUserForm.value.Title == null) {
      this.AdminTitleError = true;
    }
    else {
      this.AdminTitleError = false;
    }
  }

  AdminUserSave() {
    this.Loader = true;
    if (this.AdminUserForm.value.FirstName == '' || this.AdminUserForm.value.FirstName == null ||
      this.AdminUserForm.value.LastName == '' || this.AdminUserForm.value.LastName == null ||
      this.AdminUserForm.value.Phone == '' || this.AdminUserForm.value.Phone == null || this.AdminPhoneExists == true ||
      this.AdminUserForm.value.Email == '' || this.AdminUserForm.value.Email == null || this.AdminEmailExists == true ||
      this.AdminUserForm.value.Title == '' || this.AdminUserForm.value.Title == null) {
      this.onAdminFirstName();
      this.onAdminLastName();
      this.onAdminPhone();
      this.onAdminEmail();
      this.onAdminTitle();
      this.Loader = false;
    }
    else {
      let adminUser = {
        Id: this.AdminUserId == 0 ? 0 : this.AdminUserId,
        UserId: this.UserId,
        FirstName: this.AdminUserForm.value.FirstName,
        LastName: this.AdminUserForm.value.LastName,
        EmailId: this.AdminUserForm.value.Email,
        PhoneNumber: this.AdminUserForm.value.Phone,
        Title: this.AdminUserForm.value.Title,
        Password: 'Excel@123',
        RoleMapping: this.RoleFeatureMapping
      }
      if (this.AdminUserId == 0) {
        this.settingService.CreateAdminUser(adminUser).subscribe(data => {
          if (data.statusCode == 1) {
            console.log(data, 'createadmin');
            this.toastr.success("Admin user created successfully", "Success!");
            this.AddAdminUserPopup = false;
            this.GetAdminUsers();
          }
          else {
            this.Loader = false;
            this.toastr.error("Admin user created failed", "Failed!");
            this.AddAdminUserPopup = false;
          }
        })
      }
      else {
        this.settingService.UpdateAdminUser(adminUser).subscribe(data => {
          if (data == 1) {
            console.log(data, 'createadmin');
            this.toastr.success("Admin user updated successfully", "Success!");
            this.AddAdminUserPopup = false;
            this.GetAdminUsers();
          }
          else {
            this.Loader = false;
            this.toastr.error("Admin user updated failed", "Failed!");
            this.AddAdminUserPopup = false;
          }
        })
      }
    }
  }

  EditAdminUser(val: any) {
    this.Loader = true;
    console.log(val, 'edit')
    this.AddAdminUserPopup = true;
    this.AdminUserId = val.id;
    this.AdminUserForm.patchValue({
      FirstName: val.firstName,
      LastName: val.lastName,
      Phone: val.phoneNumber,
      Email: val.emailId,
      Title: val.title
    })
    this.GetUserFeatureMapping();
  }

  DeleteAdminUser(val: any) {
    this.AdminUserId = val.id;
    this.AdminUserDeleteConfirmationPopup = true;
  }

  ConfirmDeleteAdminUser() {
    this.Loader = true;
    let adminuser = {
      Id: this.AdminUserId,
      UserId: this.UserId
    }
    this.settingService.DeleteAdminUser(adminuser).subscribe(data => {
      if (data == 1) {
        this.toastr.success("Admin user deleted successfully", "Success!");
        this.GetAdminUsers();
        this.AdminUserDeleteConfirmationPopup = false;
      }
      else {
        this.Loader = false;
        this.AdminUserDeleteConfirmationPopup = false;
        this.toastr.error("Admin user can't be deleted", "Failed!");
      }
    })
  }

  CancelConfirm() {
    this.Loader = true;
    this.AdminAccountStatusPopup = false;
    this.GetAdminUsers();
  }

  onAdminAcccountStatus(val: any) {
    console.log(val, 'accstatus')
    this.AdminUserId = val.id
    this.AdminAccountStatusPopup = true;
    if (val.status == 1) {
      this.AdminAccountEnable = true;
    }
    else {
      this.AdminAccountEnable = false;
    }
  }

  AdminUserAccountStatus() {
    this.Loader = true;
    let adminuser = {
      Id: this.AdminUserId,
      UserId: this.UserId,
      Status: this.AdminAccountEnable == true ? 1 : 0
    }
    this.settingService.AdminUserAccountStatus(adminuser).subscribe(data => {
      if (data == 1) {
        this.GetAdminUsers();
        this.AdminAccountStatusPopup = false;
      }
      else {
        this.Loader = false;
        this.AdminAccountStatusPopup = false;
      }
    })
  }

  GetRoleFeatureMapping() {
    this.RoleFeatureMapping = [];
    this.settingService.GetRoleFeatureMapping(this.RoleId).subscribe(data => {
      this.RoleFeatureMapping = data;
      let x = this.RoleFeatureMapping.filter((x: { active: boolean; }) => x.active == false);
      if (x.length == 0) {
        this.SelectAllChecked = true;
      }
      else {
        this.SelectAllChecked = false;
      }
      this.Loader = false;
      console.log(this.RoleFeatureMapping, 'RoleFeatureMapping')
    })
  }

  GetUserFeatureMapping() {
    this.RoleFeatureMapping = [];
    this.settingService.GetUserFeatureMapping(this.AdminUserId).subscribe(data => {
      this.RoleFeatureMapping = data;
      let x = this.RoleFeatureMapping.filter((x: { active: boolean; }) => x.active == false);
      if (x.length == 0) {
        this.SelectAllChecked = true;
      }
      else {
        this.SelectAllChecked = false;
      }
      this.Loader = false;
    })
  }

  SelectAll(event: any) {
    const checked = event.target.checked;
    if (event.target.checked) {
      this.RoleFeatureMapping.forEach((item: { active: any; }) => item.active = checked);
    }
    else {
      this.RoleFeatureMapping.forEach((item: { active: any; }) => item.active = checked);
    }
  }

  Select(e: any, e1: any) {
    console.log(e1.target.value, 'e1')
    let x = this.RoleFeatureMapping.filter((x: { id: any; }) => x.id == e.id)
    if (x.length > 0) {
      x[0].active = !e.active;
    }
  }

  KeyAdminUser(val: any) {
    this.AdminUserId = val.id;
    this.AdminOwnerAccountPopup = true;
  }

  UpdateOwnerAccount() {
    this.Loader = true;
    let adminuser = {
      Id: this.AdminUserId,
      UserId: this.UserId,
      IsOwner: true
    }
    this.settingService.UpdateOwnerAccount(adminuser).subscribe(data => {
      if (data == 1) {
        this.toastr.success("Admin ownership updated", "Success!");
        this.GetAdminUsers();
        this.AdminOwnerAccountPopup = false;
      }
      else {
        this.Loader = false;
        this.AdminOwnerAccountPopup = false;
        this.toastr.error("Can't be update ownership", "Failed!");
      }
    })
  }

  GetEmailTemplate() {
    this.settingService.GetEmailTemplate().subscribe(data => {
      this.EmailTemplate = data;
      this.AdminEmailTemplate = this.EmailTemplate.filter((x: { emailTypeId: number; }) => x.emailTypeId == 3);
      this.UserEmailTemplate = this.EmailTemplate.filter((x: { emailTypeId: number; }) => x.emailTypeId == 4);
      this.Loader = false;
      console.log(this.EmailTemplate, 'emailtemplate');
      console.log(this.AdminEmailTemplate, 'AdminEmailTemplate');
      console.log(this.UserEmailTemplate, 'UserEmailTemplate');
    })
  }

  onEmailTemplate(val: any) {
    this.EmailTemplateId = val.id;
    this.EmailSubject = val.subject;
    this.EmailContent = val.bodyContent;
  }

  PreviewTemplate() {
    this.PreviewEmailPopup = true;
  }

  SaveTemplate() {
    this.Loader = true;
    var emailTemplate = {
      Id: this.EmailTemplateId,
      UserId: this.UserId,
      Subject: this.EmailSubject,
      BodyContent: this.EmailContent
    }
    this.settingService.UpdateEmailTemplate(emailTemplate).subscribe(data => {
      if (data == 1) {
        this.toastr.success("Email Template updated successfully", 'Success!');
        this.GetEmailTemplate();
      }
      else {
        this.Loader = false;
        this.toastr.error("Email Template can't be updated", 'Error!');
      }
    })
  }

  onAdminEmailTemplate(val: any) {
    this.EmailTemplateId = val.id;
    this.EmailTemplateActiveInactivePopup = true;
    console.log(val, 'adminemailtemplateconfirmation')
    if (val.isEnabled == true) {
      this.EmailTemplateEnable = true;
    }
    else {
      this.EmailTemplateEnable = false;
    }
  }

  CancelEmailTemplate() {
    this.Loader = true;
    this.EmailTemplateActiveInactivePopup = false;
    this.GetEmailTemplate();
  }

  EmailTemplateStatusUpdate() {
    this.Loader = true;
    let emailTemplate = {
      Id: this.EmailTemplateId,
      UserId: this.UserId,
      IsEnabled: this.EmailTemplateEnable
    }
    this.settingService.UpdateEmailTemplateStatus(emailTemplate).subscribe(data => {
      if (data == 1) {
        this.EmailTemplateActiveInactivePopup = false;
        if (this.EmailTemplateEnable == true) {
          this.toastr.success("Email template has been enabled", "Success!");
        }
        else {
          this.toastr.success("Email template has been disabled", "Success!");
        }
        this.GetEmailTemplate();
      }
      else {
        this.EmailTemplateActiveInactivePopup = false;
        this.Loader = false;
        if (this.EmailTemplateEnable == true) {
          this.toastr.success("Email template can't be enabled", "Success!");
        }
        else {
          this.toastr.success("Email template can't be disabled", "Success!");
        }
      }
    })
  }

  GetCredorInfo() {
    this.settingService.GetCredorInfo().subscribe(data => {
      this.CredorInfoList = data;
      this.PrivacyPolicy = this.CredorInfoList.filter((x: { credorInfoTypeId: number; }) => x.credorInfoTypeId == 1);
      this.TermsandCondition = this.CredorInfoList.filter((x: { credorInfoTypeId: number; }) => x.credorInfoTypeId == 2);
      this.Loader = false;
      console.log(this.CredorInfoList, 'Credorinfolist')
      console.log(this.PrivacyPolicy, 'PrivacyPolicy')
      console.log(this.TermsandCondition, 'TermsandCondition')
    })
  }

  SavePrivacyPolicy(){
    this.Loader = true;
    let privacy = {
      Id : this.CredorInfoId,
      UserId : this.UserId,
      BodyContent : this.EmailContent
    }
    this.settingService.UpdateCredorInfo(privacy).subscribe(data =>{
      if(data == 1){
        this.GetCredorInfo();
        this.toastr.success("Template updated successfully","Success!");
      }
      else{
        this.Loader =false;
        this.toastr.error("Template can't be update","Error!");
      }
    })
  }
}
