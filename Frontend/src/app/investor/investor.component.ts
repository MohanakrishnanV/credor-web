import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account/account.service';
import { DistributionService } from '../distributions/distribution.service';
import { DocumentService } from '../documents/document.service';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { LeadService } from '../lead/lead.service';
import { InvestorService } from './investor.service';
import { InvestService } from '../invest/invest.service';
import { Thumbs } from 'swiper';
import { elementAt } from 'rxjs-compat/operator/elementAt';
import { FileHandle } from '../documents/file.directive';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';
import { AddInvestmentComponent } from '../add-investment/add-investment.component';
import { AccountStatementComponent } from '../account-statement/account-statement.component';

@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit {
  @ViewChild(AccountStatementComponent) accountStatementComponent: any;
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChild(AddInvestmentComponent) addInvestmentComponent: any;
  @ViewChild(AddReservationComponent) addReservationComponent: any;
  @ViewChild(AddProfileComponent) addProfileComponent: any;
  @ViewChild(AddProfileComponent) ProfileValueData: any = [];
  Profile: any;
  config: any;
  InvestorDetailsData: any = [];
  InvestorDetails: any = [];
  LookingInvest: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Less than $10,000' },
    { id: 2, value: '$10,000 to $50,000' },
    { id: 3, value: '$50,000 to $100,000' },
    { id: 4, value: '$100,000 to $250,000' },
    { id: 5, value: 'More than $250,000' },
  ];
  SelectAllCheckbox: boolean = false;
  TagDetailsList: any = [];
  ChooseBool: boolean = false;
  AddTagPopup: boolean = false;
  TagName: any;
  TagDetails: any = [];
  TagDetails1: any = [];
  dropdownSettings: any = {};
  ShowFilter = false;
  selectedItems: any = [];
  MultiTag: any =[];
  disabled = false;
  Tagdetail : any;
  TagDetailsId: any = 0;
  UserId: any;
  Loader: boolean = false;
  TagId: any = 0;
  NotePopup: boolean = false;
  TableView: boolean = false;
  InvestorNoteId: any;
  InvestorData: any = [];
  DocumentTypes: any = [];
  DocumentTypeId: any = 0;
  DocumentProfileId: any = 0;
  DocumentUserId: any = 0;
  NameDelimiters: any = [];
  NameDelimiterId: any = 0;
  NamePositions: any = [];
  NamePositionId: any = 0;
  NameSeparators: any = [];
  NameSeparatorId: any = 0;
  UploadFile: boolean = false;
  batchName: any;
  batchStatus: any = 1;
  batchNameError: boolean = false;
  delimiterSeparatorError: boolean = false;
  delimiterError: boolean = false;
  namePositionError: boolean = false;
  nameSeparatorError: boolean = false;
  documentTypeError: boolean = false;
  ReservationId: any = 0;
  InvestmentId: any = 0;
  ReservationActive: boolean = true;
  WriteNoteBool: boolean = false;
  InvestorNotes: any;
  EditBool: boolean = false;
  EditInvestorNoteId: any;
  InvestorEmpty: boolean = false;
  UserView: boolean = false;
  ShowBulkDocumentUpload: boolean = false;
  ShowDocumentBatchDetail: boolean = false;
  BulkDocumentUploadPopUp: boolean = false;
  PublishDocumentsConfirmPopup: boolean = false;
  DocumentBatches: any = [];
  UserDetails: any;
  Residency: any = [];
  Selected: any;
  ActivityShow: boolean = false;
  NotesShow: boolean = false;
  EmailShow: boolean = false;
  DocsShow: boolean = false;
  DistributionsShow: boolean = false;
  ReservationsShow: boolean = false;
  InvestmentsShow: boolean = false;
  ProfileShow: boolean = false;
  AdditionalUserShow: boolean = false;
  ArchiveShow: boolean = false;
  EditProfileForm: any;
  EditProfilePopup: boolean = false;
  FirstnameError: boolean = false;
  LastnameError: boolean = false;
  AddEmailError: boolean = false;
  validEmail: boolean = false;
  ResidencyId: any = 0;
  CountryShow: boolean = false;
  LookingInvestId: any = 0;
  InvestorDatabool: any = null;
  AccreditedInvestorId: any = 0;
  AccreditedInvestor: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Yes' },
    { id: 2, value: 'No' },
  ];
  LeadEditId: any;
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
  UpdatePassword: boolean = false;
  VerifyAccountPopup: boolean = false;
  verifyuser: boolean = false;
  VerifyAccountBool: boolean = false;
  VerifyAccreditPopup: boolean = false;
  VerifyAccreditBool: boolean = false;
  Accreditverifyuser: boolean = false;
  ShowHeaderSummary: boolean = true;
  InvestorHeaderSummary: any;
  InvestorsHeaderSummary: any;
  ReservationData: any;
  InvestmentData: any;
  InvestorProfileData: any;
  InvestorProfileDetail: any;
  InvestorsData: any = [];
  Investors: any = [];
  UpdateInvestorNotes: any;
  InvestorEditNote: boolean = false
  InvestorId: any;
  DocumentData: any = [];
  DeleteDocumentPopup: boolean = false;
  DeleteData: any;
  DistributionData: any = [];
  DistributionAmount: any = 0;
  NotificationData: any = [];
  Notification: any = [];
  AccountAccesstoOther: any = [];
  AddEditReservationPopup: boolean = false;
  MinInvestment: any = 0;
  ProfileValue: any = [];
  ReservationListId: any = 0;
  ReservationList: any = [];
  OfferingList: any = [];
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
  Lastname: any;
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
  DistributionMethodId: any;
  Distributionmethod: any;
  BankAccountId: any = 0;
  CheckForm: any;
  OtherDetails: any;
  ACHBool: boolean = false;
  CheckBool: boolean = false;
  OtherBool: boolean = false;
  DistrubutionId: any = '0';
  DistributionValue: any = [];
  BankDetails: any = [];
  BankDetailsData: any = [];
  StreetBool: boolean = false;
  CityBool: boolean = false;
  ZipcodeBool: boolean = false;
  profile: any;
  ProfileId: any = 0;
  BankId: any = 0;
  DeleteBankPopup: boolean = false;
  BankPopup: boolean = false;
  BankTitleShow: boolean = false;
  BanknameError: boolean = false;
  AccounttypeError: boolean = false;
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
  Accounttype: any = 0;
  Bankname: any;
  Routingnumber: any;
  Confirmroutingnumber: any;
  ExistProfileShow: boolean = false;
  ExistProfileHide: boolean = false;
  UserData: any;
  ConfidenceLevelId: any = 0;
  ConfidenceLevel: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Very Likely' },
    { id: 2, value: 'Likely' },
    { id: 3, value: 'Unlikely' }
  ];
  InvestmentStatus: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Approved' },
    { id: 2, value: 'Pending' },
    { id: 5, value: 'Waitlisted' },
    { id: 6, value: 'Declined' },
    { id: 7, value: 'Ownership Sold' },
  ];

  AddEditData: any = 'edit';
  IsAddReservationPopup: any = false;
  IsEditReservationPopup: any = false;
  ShowProfileDetail: any = false;
  allowedFileExtensions: any = [];
  DocumentFile: any = [];
  DocumentBatchDetail: any = [];
  filesToUpload: any = [];
  userProfiles: any = [];
  MatchedDocuments: any = [];
  FinalMatchedDocuments: any = [];
  TotalDocuments: any = 0;
  TotalMatched: any = 0;
  TotalUnmatched: any = 0;
  files: FileHandle[] = [];
  BatchId: any = 0;
  TypeId: any = 0;
  DocSizeBool: boolean = false;
  DocSizeCount: any = 0;
  BulkUploadStepNavigation: boolean = false;
  uploadFilesShow: any = true;
  uploadFilesDone: any = false;
  matchShow: any = false;
  matchDone: any = false;
  reviewShow: any = false;
  reviewDone: any = false;
  publishShow: any = false;
  publishDone: any = false
  DocumentProfiles: any = [];
  remoteWindow: Window | undefined;
  uploadFile: boolean = false;
  removedoc: any = [];
  InvestorDataValue: any;
  reviewFilePath: any = [];
  pdfUrl: any;
  ReviewDocumentViewPopup: boolean = false;
  PortfolioData: any;
  AccountStatementDataValue: any;
  AccountStatementPopup: boolean = false;
  AccountStatementArray: any = [];

  constructor(private investorService: InvestorService,
    private investService: InvestService,
    private profileService: InvestorProfileService,
    private leadService: LeadService,
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private distributionService: DistributionService,
    private accountService: AccountService,
    private toastr: ToastrService, private route: ActivatedRoute, private router: Router
  ) {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.InvestorDetails.length
    };
  }

  ngOnInit(): void {
    this.Loader = true;
    localStorage.removeItem("InvestorId");
    this.allowedFileExtensions = ['pdf'];
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
    })
    this.GetInvestor();
    this.GetTag();
    this.GetTagForMultiSelect();
    this.GetStateProvince();
    this.GetProfile();
    this.GetReservationList();
    this.GetOfferingList();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: this.ShowFilter
    };
    this.AddEditData = 'edit';
  }
  GetInvestorsSummaryHeader() {
    this.investorService.GetInvestorsHeadingSummary().subscribe(data => {
      this.InvestorsHeaderSummary = data;
      this.Loader = false
    })
  }
  GetInvestor() {
    this.investorService.GetInvestor().subscribe(data => {
      this.InvestorDetailsData = data;
      this.InvestorDetails = data;
      this.GetInvestorsSummaryHeader();
    })
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
  OnCancelProfile(profile: any) {
    var profileName = this.GetProfileNamebyType(profile);
    this.InvestorProfileDetail = [];
    // this.InvestorProfileData.forEach((element:any) =>
    // {
    //   this.InvestorProfileDetail.push({ id: element.id,
    //     profileName: this.GetProfileNamebyType(element),
    //     type: element.type,
    //     typeName: element.typeName,
    //     profileDisplayId : element.profileDisplayId,
    //     address : element.streetAddress1 + ' ' + element.streetAddress2,
    //     city:element.city,
    //     country:element.country,
    //     state: (element.stateOrProvinceId == 0?element.state: this.GetStateOrProvinceName(element.stateOrProvinceId)),
    //     zipCode: element.zipCode,
    //     taxId: element.taxId,
    //     isDisregardedEntity: element.isDisregardedEntity,
    //     isIRALLC:element.isIRALLC,
    //     taxIdofOwner:element.OwnerTaxId,
    //     showProfileDetail: false,
    //     distributionTypeId:element.distributionTypeId == null?0:element.distributionTypeId,
    //     paymentMethod:element.paymentMethod,
    //     bankName:element.bankName,
    //     bankAccountType: element.bankAccountType,
    //     bankRoutingNumber: element.bankRoutingNumber,
    //     bankAccountNumber: element.bankAccountNumber,
    //     checkIncareOf:element.checkInCareOf,
    //     checkAddress: element.CheckAddressLine1 + ' ' + element.checkAddressLine2,
    //     checkCity: element.checkCity,
    //     checkState: (element.checkStateId == 0? '':this.GetStateOrProvinceName(element.checkStateId)),
    //     checkZip:element.checkZip,
    //     otherDetails: element.distributionDetail,
    //     investors: element.investors
    //   });
    // });
  }
  OnAddNewProfile() {

  }
  OnEditProfile(value: any, e: any) {
    this.addProfileComponent.onProfileEdit(value, e);
  }
  GetStateOrProvinceName(id: any) {
    if (id != 0) {
      var residency = this.Residency.filter((x: { id: any; }) => x.id == id);
      return residency[0].name;
    }
    else
      return '-';
  }
  GetDistributionType(id: any) {
    if (id != 0) {
      var residency = this.Residency.filter((x: { id: any; }) => x.id == id);
      return residency[0].name;
    }
    else
      return '-';
  }
  GetStateProvince() {
    this.profileService.GetStateorProvince().subscribe(data => {
      let x = { id: 0, name: 'Select', active: true }
      this.Residency = data;
      this.Residency.unshift(x);
    })
  }
  FilterLead(e: any) {
    let x = e.target.value
    this.InvestorDetails = [];
    if (x == null || x == '') {
      this.InvestorDetails = this.InvestorDetailsData;
    } else {
      this.InvestorDetailsData.forEach((element: { fullName: string; emailId: string; phoneNumber: string; }) => {
        if (element.fullName.toLowerCase().includes(x.toLowerCase())
          || element.emailId.toLowerCase().includes(x.toLowerCase())
          || element.phoneNumber.toLowerCase().includes(x.toLowerCase())) {
          this.InvestorDetails.push(element);
        }
      });
    }
  }
  onChooseDataPerPage(event: any) {
    if (+event.target.value == 0) {
      this.config.itemsPerPage = 5
    }
    else {
      this.config.itemsPerPage = +event.target.value
    }
  }
  pageChanged(event: any) {
    this.config.currentPage = event;
    this.TagDetailsList = [];
  }
  onItemSelect(item: any) {
    this.selectedItems.push({ item });
  }
  SelectAll(event: any) {
    const checked = event.target.checked;
    if (event.target.checked) {
      this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = checked);
      for (let i = 0; i < this.InvestorDetails.length; i++) {
        // this.DeleteArray.push({ Id: this.InvestorDetails[i].id })
        this.TagDetailsList.push({ Id: 0, TagId: 0, UserId: this.InvestorDetails[i].id, Active: true })
        // this.ResendInviteArray.push(this.LeadDetails[i])
      }
    }
    else {
      this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = checked);
      this.TagDetailsList = [];
    }
    if (this.TagDetailsList.length == 0) {
      this.ChooseBool = true;
    }
    else {
      this.ChooseBool = false;
    }
  }
  Select(e: any, e1: any) {
    if (e1.target.checked) {
      this.TagDetailsList.push({ Id: 0, TagId: 0, UserId: e.id, Active: true })
    }
    else {
      this.TagDetailsList = this.TagDetailsList.filter((x: { UserId: any; }) => x.UserId != e.id)
    }
    if (this.TagDetailsList.length == 0) {
      this.ChooseBool = true;
    }
    else {
      this.ChooseBool = false;
    }
  }
  onAddTag() {
    if (this.TagDetailsList.length == 0) {
      this.toastr.info("Please select any row from the table", "Info!")
      this.ChooseBool = true;
    }
    else {
      this.AddTagPopup = true;
      this.TagDetailsId = 0;
      this.TagName = ''
    }
  }
  GetTag() {
    this.investorService.GetInvestorTag(this.UserId).subscribe(data => {
      let x = { id: 0, name: 'Select Tag', active: true }
      this.TagDetails = data;
      this.TagDetails.unshift(x);
      this.Loader = false;
    })
  }
  GetTagForMultiSelect() {
    this.investorService.GetInvestorTag(this.UserId).subscribe(data => {
      this.TagDetails1 = data;
      this.Loader = false;
    })
  }
  onSaveTag() {
    this.Loader = true;
    // if (this.TagName == null || this.TagName == '') {
    //   this.Loader = false;
    // }
    if(this.selectedItems.length > 0)
    {
      for(let i=0;i<this.selectedItems.length;i++)
      {
        this.TagId = this.selectedItems[i].item.id;
        this.TagName = this.selectedItems[i].item.name;
        // let Tag = {
        //   Id: this.TagId != 0 ? this.TagId : 0,
        //   AdminUserId: this.UserId,
        //   Name: this.TagName,
        //   Active: true,
        //   tagDetails: this.TagDetailsList
        // }
        this.MultiTag.push({Id: this.TagId != 0 ? this.TagId : 0,AdminUserId: this.UserId,
          Name: this.TagName,Active: true,
          tagDetails: this.TagDetailsList
        });
      }
      this.investorService.UpdateMultipleInvestorTag(this.MultiTag).subscribe(data => {
        if(data)
        {
          this.AddTagPopup = false;
          this.Loader = false;
        }
      })
    }
    // else {
    //   let x = this.TagDetails.filter((x: { name: any; }) => x.name == this.TagName)
    //   if (x.length > 0) {
    //     this.TagId = x[0].id;
    //   }
    //   else {
    //     this.TagId = 0;
    //   }
    //   let Tag = {
    //     Id: this.TagId != 0 ? this.TagId : 0,
    //     AdminUserId: this.UserId,
    //     Name: this.TagName,
    //     Active: true,
    //     tagDetails: this.TagDetailsList
    //   }
    //   if (this.TagId == 0) {
    //     this.investorService.AddInvestorTag(Tag).subscribe(data => {
    //       if (data == true) {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.TagDetailsId = 0;
    //         this.GetTag();
    //         this.TagDetailsId = 0;
    //       }
    //       else {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.TagDetailsId = 0;
    //         this.Loader = false;
    //       }
    //     })
    //   }
    //   else if (this.TagId != 0) {
    //     this.investorService.UpdateInvestorTag(Tag).subscribe(data => {
    //       if (data == true) {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.TagDetailsId = 0;
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.TagDetailsId = 0;
    //         this.GetTag();
    //       }
    //       else {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.TagDetailsId = 0;
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.Loader = false;
    //       }
    //     })
    //   }
    // }
  }
  onChooseTags(e: any) {
    let a = +e.target.value
    if (a == 0) {
      this.InvestorDetails = this.InvestorDetailsData;
    }
    else {
      let x = this.TagDetails.filter((x: { id: any; }) => x.id == a)
      let b = x[0].tagDetails;
      this.InvestorDetails = [];
      for (let i = 0; i < b.length; i++) {
        let c = this.InvestorDetailsData.filter((x: { id: any; }) => x.id == b[i].userId)
        if (c.length > 0) {
          this.InvestorDetails.push(c[0])
        }
      }
    }
  }
  onNotes(e: any) {
    this.NotePopup = true;
    this.EditBool = false;
    this.InvestorNoteId = e.id;
    this.EditInvestorNoteId = 0;
    this.WriteNoteBool = false;
    this.GetLeadId();
  }
  GetLeadId() {
    this.investorService.GetInvestorNotes(this.InvestorNoteId).subscribe(data => {
      this.InvestorData = data;
      if (this.InvestorData.length > 0) {
        this.TableView = true;
        // this.InvestorNotes = this.InvestorData[0].notes
        this.InvestorNotes = ''
      }
      else {
        this.TableView = false;
        this.InvestorEmpty = true;
      }
      this.Loader = false;
    })
  }
  EditNote(e: any) {
    this.WriteNoteBool = true;
    this.TableView = false;
    this.EditBool = true;
    this.InvestorNotes = e.notes;
    this.EditInvestorNoteId = e.id
  }
  DeleteNote(e: any) {
    this.Loader = true;
    this.investorService.DeleteInvestorNotes(this.UserId, e.id).subscribe(data => {
      if (data == true) {
        this.WriteNoteBool = false;
        this.GetLeadId();
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
  OnCancel() {
    this.WriteNoteBool = false;
    if (this.InvestorData.length > 0) {
      this.TableView = true;
      this.InvestorNotes = this.InvestorData[0].notes
    }
    else {
      this.InvestorEmpty = true;
    }
  }
  NoteSave() {
    this.Loader = true;
    let notes = {
      Id: this.EditInvestorNoteId != 0 ? this.EditInvestorNoteId : 0,
      AdminUserId: this.UserId,
      UserId: this.InvestorNoteId,
      Notes: this.InvestorNotes,
      Active: true
    }
    if (this.EditInvestorNoteId == 0) {
      this.investorService.AddInvestorNotes(notes).subscribe(data => {
        if (data == true) {
          this.WriteNoteBool = false;
          this.GetLeadId();
        }
        else {
          this.Loader = false;
        }
      })
    }
    else {
      this.investorService.UpdateInvestorNotes(notes).subscribe(data => {
        if (data == true) {
          this.WriteNoteBool = false;
          this.GetLeadId();
        }
        else {
          this.Loader = false;
        }
      })
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
        this.GetLeadId();
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
        this.GetLeadId();
        this.InvestorNotes = '';
      }
      else {
        this.Loader = false;
      }
    })
  }
  onWriteANote() {
    this.InvestorEmpty = false;
    this.WriteNoteBool = true;
    this.EditBool = false;
    this.InvestorNotes = '';
  }
  onBack() {
    this.UserView = false;
    localStorage.removeItem("InvestorId");
  }
  OnBulkUploadStepNavigationBack() {
    this.ShowBulkDocumentUpload = true;
    this.ShowDocumentBatchDetail = true;
    this.BulkUploadStepNavigation = false;
    this.DocumentTypeId = 0;
    this.NameDelimiterId = 0;
    this.NamePositionId = 0;
    this.NameSeparatorId = 0;
    this.batchName = '';
    this.UserView = false;
    this.ShowHeaderSummary = false;
    this.ShowBulkDocumentUpload = true;
    this.ShowDocumentBatchDetail = true;
    this.Loader = true;
    this.investorService.GetAllDocumentBatches().subscribe(data => {
      this.DocumentBatches = data;
      this.Loader = false;
    });
  }
  onDocumentProfileChange(id: any) {
    this.DocumentProfileId = id;
  }
  onDocumentTypeChange(e: any) {
    this.DocumentTypeId = +e.target.value;
    if (this.DocumentTypeId == 0) {
      this.documentTypeError = true;
    }
    else {
      this.documentTypeError = false;
    }
  }
  onNameDelimiterChange(e: any) {
    this.NameDelimiterId = +e.target.value;
  }
  onNamePositionChange(e: any) {
    this.NamePositionId = +e.target.value;
  }
  onNameSeparatorChange(e: any) {
    this.NameSeparatorId = +e.target.value;
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
  GetDocumentNameSeparators() {
    this.NameSeparators = [];
    this.investorService.GetDocumentNameSeparators().subscribe(data => {
      let x: any = data
      this.NameSeparators.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.NameSeparators.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  GetDocumentNameDelimiters() {
    this.NameDelimiters = [];
    this.investorService.GetDocumentNameDelimiters().subscribe(data => {
      let x: any = data
      this.NameDelimiters.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.NameDelimiters.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  GetDocumentNamePositions() {
    this.NamePositions = [];
    this.investorService.GetDocumentNamePositions().subscribe(data => {
      let x: any = data
      this.NamePositions.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.NamePositions.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  OnBulkDocumentPopupCancel() {
    this.BulkDocumentUploadPopUp = false;
    this.batchNameError = false;
    this.delimiterError = false;
    this.namePositionError = false;
    this.documentTypeError = false;
    this.nameSeparatorError = false;
    this.delimiterSeparatorError = false;
    this.batchName = '';
    this.DocumentTypeId = 0;
    this.NameDelimiterId = 0;
    this.NamePositionId = 0;
    this.NameSeparatorId = 0;
  }
  OnBulkDocumentPopupNext() {
    if (this.batchName == "" || this.batchName == null) {
      this.batchNameError = true;
    }
    else {
      this.batchNameError = false;
    }

    if (this.DocumentTypeId == 0) { this.documentTypeError = true; }
    else { this.documentTypeError = false; }

    if (this.NameDelimiterId == 0) { this.delimiterError = true; }
    else { this.delimiterError = false; }

    if (this.NameSeparatorId == 0) { this.nameSeparatorError = true; }
    else { this.nameSeparatorError = false; }

    if (this.NamePositionId == 0) { this.namePositionError = true; }
    else { this.namePositionError = false; }

    if (this.batchNameError || this.documentTypeError || this.delimiterError || this.nameSeparatorError || this.namePositionError) {
      this.BulkDocumentUploadPopUp = true;
    }
    else if (this.NameDelimiterId == this.NameSeparatorId) {
      this.delimiterSeparatorError = true;
    }
    else {
      this.BulkDocumentUploadPopUp = false;
      this.delimiterSeparatorError = false;
      this.UserView = false;
      this.ShowHeaderSummary = false;
      this.ShowBulkDocumentUpload = false;
      this.ShowDocumentBatchDetail = false;

      this.UploadFile = true;
      this.DocumentFile = [];
      this.DocSizeBool = false;
      this.DocSizeCount = 0;
      this.BulkUploadStepNavigation = true;
      this.UserView = false;
      this.ShowBulkDocumentUpload = false;
      this.ShowDocumentBatchDetail = false;
    }
  }

  onFileChange(files: FileHandle[]) {
    for (var i = 0; i < files.length; i++) {
      let ext: any;
      this.allowedFileExtensions.forEach((element: any) => {
        if (element == files[i].file.name.split('.').pop()) {
          this.DocumentFile.push({ Id: this.DocumentFile.length * -1, File: files[i].file });
          this.filesToUpload.push(files[i].file);
        }
      });
      const reader = new FileReader();
      reader.readAsDataURL(files[i].file)
      reader.onload = () => {
        this.reviewFilePath.push(reader.result?.toString());
      }
    }
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
  }
  onFileChange1(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      let ext: any;
      this.allowedFileExtensions.forEach((element: any) => {
        if (element == event.target.files[i].name.split('.').pop()) {
          this.filesToUpload.push(event.target.files[i]);
          this.DocumentFile.push({ Id: this.DocumentFile.length * -1, File: event.target.files[i] });
        }
      });
    }
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
  }
  OnRemoveDoc(id: any) {
    this.DocSizeCount = 0;
    this.removedoc = this.DocumentFile.filter((x: { Id: any; }) => x.Id == id)
    this.DocumentFile = this.DocumentFile.filter((x: { Id: any; }) => x.Id != id)
    this.filesToUpload = this.filesToUpload.filter((x: { name: any; }) => x.name != this.removedoc[0].File.name)
    this.DocSizeBool = false;
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
    else {
      this.DocSizeBool = false;
      this.DocSizeCount = 0;
    }
  }
  onDeleteDocument(e: any) {
    let documentId = e.documentId;
    this.investorService.DeleteDocument(this.UserId, this.BatchId, documentId).subscribe(data => {
      this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
        this.DocumentBatchDetail = data;
        this.DocumentTypeId = this.DocumentBatchDetail.documentType;
        this.batchName = this.DocumentBatchDetail.batchName;
        this.batchStatus = this.DocumentBatchDetail.status;
        this.FinalMatchedDocuments = [];
        this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
      })
      this.uploadFilesShow = false;
      this.uploadFilesDone = true;
      this.matchDone = true; this.matchShow = false;
      this.reviewDone = true; this.reviewShow = false;
      this.publishDone = true; this.publishShow = true;
    });
  }
  onEditDocument(e: any) { }
  onReviewDocuments() {
    this.uploadFilesShow = false;
    this.uploadFilesDone = true;
    this.matchShow = false;
    this.matchDone = true;
    this.reviewShow = true;
  }
  onDocumentUserChange(id: any) {
    if (id != 0 || id != 'undefined') {
      this.profileService.GetProfileById(id).subscribe(data => {
        this.DocumentProfiles = data;
        this.DocumentUserId = id;
      });
    }
  }
  onSaveandUpload() {
    if (this.DocumentFile.length <= 100 && this.DocumentFile.length > 0 && this.DocSizeBool == false) {
      this.Loader = true;
      const UploadDoc = new FormData();
      UploadDoc.append("Id", this.BatchId);
      UploadDoc.append("AdminUserId", this.UserId);
      UploadDoc.append("BatchName", this.batchName);
      UploadDoc.append("Status", "1");// this.batchStatus);
      UploadDoc.append("TotalDocuments", this.DocumentFile.length);
      UploadDoc.append("DocumentType", this.DocumentTypeId);
      UploadDoc.append("NameDelimiter", this.NameDelimiterId);
      UploadDoc.append("NamePosition", this.NamePositionId);
      UploadDoc.append("NameSeparator", this.NameSeparatorId);
      let Documents: any = [];
      this.filesToUpload.forEach((item: string | Blob) => {
        UploadDoc.append("Files", item);
      });
      this.investorService.BulkDocumentUpload(UploadDoc).subscribe(data => {
        if (data != null) {
          this.MatchedDocuments = data;
          this.TotalDocuments = this.filesToUpload.length;
          this.TotalMatched = this.MatchedDocuments.filter((x: { isMatchfound: any; }) => x.isMatchfound == true).length;
          this.TotalUnmatched = this.TotalDocuments - this.TotalMatched;
          this.UploadFile = false;
          this.BatchId = this.MatchedDocuments[0].batchId;
          this.uploadFilesShow = true;
          this.uploadFilesDone = true;
          this.matchShow = true;
          this.GetInvestor();
          this.Loader = false;
        }
      })
    }
  }

  onPublishDocuments(e: any) {
    let batchId = 0;
    let count = 0;
    this.Loader = true;
    if (this.filesToUpload.length <= 100 && this.filesToUpload.length > 0) {
      this.FinalMatchedDocuments = [];
      const UploadDoc = new FormData();
      let matchedFiles: any = [];
      this.MatchedDocuments.forEach((item: any) => {
        let batchId = item.batchId;
        if (item.userId != 0 || item.userId != '') {
          if (item.profileId == null)
            item.profileId = 0;
          count = count + 1;
          UploadDoc.append("BatchId", this.BatchId);
          UploadDoc.append("AdminUserId", this.UserId);
          UploadDoc.append("DocumentType", this.DocumentTypeId);
          this.filesToUpload.forEach((file: any | Blob) => {
            if (file.name == item.documentName) {
              let matchedFile: any;
              matchedFile = {
                UserId: item.userId,
                ProfileId: item.profileId,
                FileName: item.documentName
              }
              matchedFiles.push(matchedFile);
              UploadDoc.append("Files", file);
              UploadDoc.append("MatchedDocuments", JSON.stringify(matchedFile));
            }
          });
        }
      });

      this.investorService.PublishMatchedDocuments(UploadDoc).subscribe(data => {
        // this.BatchId = data;
        //this.updateBatch(count);
        if (data != null) {
          this.DocumentBatchDetail = data;
          this.DocumentTypeId = this.DocumentBatchDetail.documentType;
          this.batchName = this.DocumentBatchDetail.batchName;
          this.batchStatus = this.DocumentBatchDetail.status;
          this.FinalMatchedDocuments = [];
          this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
          this.uploadFilesShow = false;
          this.uploadFilesDone = true;
          this.matchShow = false;
          this.matchDone = true;
          this.reviewShow = false;
          this.reviewDone = true;
          this.publishDone = true;
          this.publishShow = true;
          this.Loader = false;
        }
      });
      this.filesToUpload = [];
    }
  }

  updateBatch(count: any) {
    let updateBatch: any;
    updateBatch = {
      AdminUserId: this.UserId,
      BatchId: this.BatchId,
      TotalDocuments: count,
      Status: 3
    }
    this.investorService.UpdateBatch(updateBatch).subscribe(data => {
      this.uploadFilesShow = false;
      this.uploadFilesDone = true;
      this.matchShow = false;
      this.matchDone = true;
      this.reviewShow = false;
      this.reviewDone = true;
      this.publishDone = true;
      this.publishShow = true;
    });

    this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
      this.DocumentBatchDetail = data;
      this.DocumentTypeId = this.DocumentBatchDetail.documentType;
      this.batchName = this.DocumentBatchDetail.batchName;
      this.batchStatus = this.DocumentBatchDetail.status;
      this.FinalMatchedDocuments = [];
      this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
      this.Loader = false;
    });
  }

  OnPublishDocumentsConfirmPopup() {
    this.PublishDocumentsConfirmPopup = true;
  }
  OnBulkUploadDocumentBack() {
    this.ShowHeaderSummary = true;
    this.UserView = false;
    this.ShowBulkDocumentUpload = false;
  }

  UploadDocuments() {
    this.BulkDocumentUploadPopUp = true;
    this.GetDocumentTypes();
    this.GetDocumentNameSeparators();
    this.GetDocumentNameDelimiters();
    this.GetDocumentNamePositions();
    this.BatchId = 0;
    this.uploadFilesShow = true;
    this.uploadFilesDone = false;
    this.reviewDone = false; this.reviewDone = false;
    this.matchDone = false; this.matchShow = false;
    this.publishDone = false; this.publishShow = false;
  }
  bulkDocumentUpload() {
    this.UserView = false;
    this.ShowHeaderSummary = false;
    this.ShowBulkDocumentUpload = true;
    this.ShowDocumentBatchDetail = true;
    this.Loader = true;
    this.investorService.GetAllDocumentBatches().subscribe(data => {
      this.DocumentBatches = data;
      this.Loader = false;
    })
  }
  onEditBatch(e: any) {
    this.Loader = false;
    this.BatchId = e.id;
    this.BulkUploadStepNavigation = true;
    this.ShowBulkDocumentUpload = false;
    this.UploadFile = true;
    this.GetDocumentTypes();
    this.GetDocumentNameDelimiters();
    this.GetDocumentNamePositions();
    this.GetDocumentNameSeparators();
    this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
      this.DocumentBatchDetail = data;
      this.DocumentTypeId = this.DocumentBatchDetail.documentType;
      this.NameDelimiterId = this.DocumentBatchDetail.nameDelimiter;
      this.NamePositionId = this.DocumentBatchDetail.namePosition;
      this.NameSeparatorId = this.DocumentBatchDetail.nameSeparator;
      this.batchName = this.DocumentBatchDetail.batchName;
      this.batchStatus = this.DocumentBatchDetail.status;
      if (this.batchStatus == 1 || this.batchStatus == 2) {
        this.uploadFilesShow = true;
        this.uploadFilesDone = false;
        this.matchDone = false; this.matchShow = false;
        this.reviewDone = false; this.reviewShow = false;
        this.publishDone = false; this.publishShow = false;
      }
      else if (this.batchStatus == 3) {
        this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
          this.DocumentBatchDetail = data;
          this.DocumentTypeId = this.DocumentBatchDetail.documentType;
          this.batchName = this.DocumentBatchDetail.batchName;
          this.batchStatus = this.DocumentBatchDetail.status;
          this.FinalMatchedDocuments = [];
          this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
        })
        this.uploadFilesShow = false;
        this.uploadFilesDone = true;
        this.matchDone = true; this.matchShow = false;
        this.reviewDone = true; this.reviewShow = false;
        this.publishDone = true; this.publishShow = true;
      }
      this.Loader = false;
    })
  }
  onDeleteBatch(e: any) {
    let batchId = e.id;
    this.investorService.DeleteDocumentBatch(this.UserId, batchId).subscribe(data => {
      this.investorService.GetAllDocumentBatches().subscribe(data => {
        this.DocumentBatches = data;
      });
    });
  }
  ViewDetails(e: any) {
    localStorage.setItem("InvestorId", e.id);
    localStorage.setItem("I_profileurl", e.profileImageUrl);
    this.Loader = true;
    this.UserView = true;
    this.UserDetails = e;
    this.Activity();
    localStorage.setItem("InvestorId", e.id)
    this.investorService.GetInvestorHeadingSummary(this.UserDetails.id).subscribe(data => {
      this.InvestorHeaderSummary = data;
      this.Loader = false;
    })
    this.GetInvestorReservationDetais();
    this.GetInvestorInvestmentDetails();
    this.InvestorNoteId = this.UserDetails.id
    this.InvestorId = this.UserDetails.id
    this.GetLeadId();
    this.GetNotification();
    this.GetDocument();
    this.GetDistrubution();

    this.InvestorDataValue = {
      InvestorId: e.id,
      ModalName: 'Add'
    }

    this.PortfolioData = {
      InvestorId: e.id,
      ModalName: 'Add'
    }

    this.AccountStatementDataValue = {
      InvestorId: e.id,
    }
    this.TagDetailsList = [];
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
  GetNotification() {
    this.accountService.GetNotification(this.InvestorId).subscribe(data => {
      this.NotificationData = data;
      this.Notification = [];
      for (let i = 0; i < 5; i++) {
        this.Notification.push(this.NotificationData[i])
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
  GetInvestorReservationDetais() {
    this.investorService.GetInvestorReservationDetais(this.UserDetails.id).subscribe(data => {
      this.ReservationData = data;
    })
  }
  GetInvestorInvestmentDetails() {
    this.investorService.GetInvestorInvestmentDetails(this.UserDetails.id).subscribe(data => {
      this.InvestmentData = data;
    })
  }

  onEditReservation(val: any) {
    this.addReservationComponent.EditReservation(val, 'investor')
  }

  onEditInvestment(val: any) {
    this.addInvestmentComponent.EditInvestment(val, 'Edit')
  }

  OnCancelAddEditReservation() {
    this.AddEditReservationPopup = false;
  }
  GetReservationList() {
    this.investorService.GetReservationList().subscribe(data => {
      let x: any = data;
      this.ReservationList = [];
      this.ReservationList.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        if (x[i].name != null) {
          this.ReservationList.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
      }
    })
  }
  GetOfferingList() {
    this.investorService.GetOfferingList().subscribe(data => {
      let x: any = data;
      this.OfferingList = [];
      this.OfferingList.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        if (x[i].name != null) {
          this.OfferingList.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
      }
    })
  }

  GetProfile() {
    this.profileService.GetProfileById(this.InvestorId).subscribe(data => {
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

  onAddNewProfile() {
    this.ProfilePopup = true;
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
    this.IRAForm.enable();
    this.LLCForm.enable();
    this.IndividualForm.enable();
    this.TrustForm.enable();
    this.JointForm.enable();
    this.RetirementForm.enable();
    this.ACHBool = false;
    this.CheckBool = false;
    this.OtherBool = false
  }

  Activity() {
    this.Selected = 'InvestorActivity';
    this.ActivityShow = true;
    this.NotesShow = false;
    this.EmailShow = false;
    this.DocsShow = false;
    this.DistributionsShow = false;
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
  Distrubutions() {
    this.Selected = 'InvestorDistributions';
    this.ActivityShow = false;
    this.NotesShow = false;
    this.EmailShow = false;
    this.DocsShow = false;
    this.DistributionsShow = true;
  }
  Reservations() {
    this.ReservationsShow = !this.ReservationsShow;
    this.GetInvestorReservationDetais();
  }
  Investments() {
    this.InvestmentsShow = !this.InvestmentsShow;
  }
  Profiles() {
    this.ProfileShow = !this.ProfileShow;
    this.GetInvestorProfiles();
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
  Archive() {
    this.ArchiveShow = !this.ArchiveShow;
  }
  CancelProfile() {
    this.EditProfilePopup = true;
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
          this.GetInvestorById(this.LeadEditId);
        }
        else {
          this.EditProfilePopup = false;
          this.toastr.error("Can't updated", "Error");
          this.Loader = false;
        }
      })
    }
  }
  GetInvestorById(id: any) {
    this.investorService.GetInvestorById(id).subscribe(data => {
      this.UserDetails = data;
      this.Loader = false
    })
  }
  EditProfile() {
    this.EditProfilePopup = true;
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
  }
  ResetPassword() {
    this.UpdatePassword = true;
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
    // else if (this.NewPassword == this.CurrentPassword) {
    //   this.MismatchCurrentPassword = true;
    //   this.EmptyPassword = false;
    //   this.ValidLowercase = false;
    //   this.ValidUppercase = false;
    //   this.ValidNumbercase = false;
    //   this.ValidSpecialcase = false;
    //   this.ValidLengthcase = false;
    // }
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
          this.UpdatePassword = false;
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
        this.UpdatePassword = false;
        this.toastr.success("Password link sent successfully", "Success!");
      }
      else {
        this.Loader = false;
        this.toastr.error("Can't reset the password", "Error!");
      }
    })
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
  CancelAccreditVerifyAccount() {
    this.VerifyAccreditPopup = false;
    this.UserDetails.isAccreditedInvestor = !this.VerifyAccreditBool
  }
  onSaveVerifyAccreditation() {
    this.Loader = true;
    this.investorService.VerifyAccreditInvestor(this.UserId, this.UserDetails.id, this.VerifyAccreditBool).subscribe(data => {
      if (data == true) {
        this.VerifyAccreditPopup = false;
        this.GetInvestorById(this.UserDetails.id);
      }
      else {
        this.VerifyAccreditPopup = false;
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
  DeleteDocument() {
    this.Loader = true;
    this.documentService.DeleteDocumentById(this.UserId, this.DeleteData.id).subscribe(data => {
      if (data == 1) {
        this.DeleteDocumentPopup = false;
        this.GetDocument();
        this.toastr.success("Document deleted successfully", "Success!")
      }
      else {
        this.Loader = false;
        this.DeleteDocumentPopup = false;
        this.toastr.error("Document cannot deleted", "Error!")
      }
    })
  }
  onBatchName() {
    if (this.batchName == ' ' || this.batchName == null) {
      this.batchNameError = true;
    }
    else {
      this.batchNameError = false;
    }
  }
  onDelimiter() {
    if (this.NameDelimiterId == 0) {
      this.delimiterError = true;
    }
    else {
      this.delimiterError = false;
    }
  }
  onNamePosition() {
    if (this.NamePositionId == 0) {
      this.namePositionError = true;
    }
    else {
      this.namePositionError = false;
    }
  }
  onNameSeparator() {
    if (this.NameSeparatorId == 0) {
      this.nameSeparatorError = true;
    }
    else {
      this.nameSeparatorError = false;
    }
  }
  onDocumentType() {
    if (this.DocumentTypeId == 0) {
      this.documentTypeError = true;
    }
    else {
      this.documentTypeError = false;
    }
  }
  receiveMessage(e: any) {
    // this.InvestorProfileData = [];
    // this.InvestorProfileData = e;
    this.GetInvestorProfiles();
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
  UploadDocument() {
    this.GetDocumentTypes();
    this.uploadFile = true;
    this.DocumentFile = [];
    this.DocSizeBool = false;
    this.DocSizeCount = 0;
    this.DocumentTypeId = 0;
  }
  onSaveandUploadInvestor() {
    this.Loader = true;
    if (this.DocumentTypeId == 0 || this.DocumentFile.length >= 10 || this.DocumentFile.length == 0 || this.DocSizeBool == true) {
      if (this.DocumentTypeId == 0) {
        this.documentTypeError = true;
      }
      else {
        this.documentTypeError = false;
      }
      this.Loader = false;
    }
    else {
      if (this.DocumentFile.length <= 10 && this.DocumentFile.length > 0 && this.DocSizeBool == false) {
        const UploadDoc = new FormData();
        let userid: any = localStorage.getItem("InvestorId")
        UploadDoc.append("UserId", userid);
        UploadDoc.append("Type", this.DocumentTypeId);
        this.filesToUpload.forEach((item: string | Blob) => {
          UploadDoc.append('Files', item);
        });
        this.documentService.UploadDocument(UploadDoc).subscribe(data => {
          if (data == true) {
            this.uploadFile = false;
            this.GetDocument();
            this.DocumentFile = [];
            this.filesToUpload = [];
            this.toastr.success("Document added successfully", "Success!")
          }
        })
      }
    }
  }

  receiveMessage1(e: any) {
    this.GetInvestorReservationDetais();
  }
  onViewReviewFile(file: any) {
    let index = this.filesToUpload.findIndex((x: { name: any }) => x.name == file.documentName)
    this.pdfUrl = this.reviewFilePath[index].toString();
    this.ReviewDocumentViewPopup = true;
  }
  onReviewDownloadFile(file: any) {
    let index = this.filesToUpload.findIndex((x: { name: any }) => x.name == file.documentName);
    let url = this.reviewFilePath[index];
    var a = document.createElement('a');
    a.href = url;
    a.download = file.documentName;
    a.click();
  }
  onDeleteReviewDocument(file: any) {
    let index = this.MatchedDocuments.findIndex((x: { name: any }) => x.name = file.FileName);
    this.MatchedDocuments.splice(index, 1);
    this.reviewFilePath.splice(index, 1);
    this.FinalMatchedDocuments = this.MatchedDocuments;
  }
  OnRemoveREviewDoc(id: any) {
    this.DocSizeCount = 0;
    this.removedoc = this.DocumentFile.filter((x: { Id: any; }) => x.Id == id)
    this.DocumentFile = this.DocumentFile.filter((x: { Id: any; }) => x.Id != id)
    let index = this.filesToUpload.findIndex((x: { name: any }) => x.name == this.removedoc[0].File.name);
    this.filesToUpload = this.filesToUpload.filter((x: { name: any; }) => x.name != this.removedoc[0].File.name)
    this.reviewFilePath.splice(index, 1);
    this.DocSizeBool = false;
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
    else {
      this.DocSizeBool = false;
      this.DocSizeCount = 0;
    }
  }

  receiveMessage2(e: any) {
    this.GetInvestorInvestmentDetails();
  }

  onAccountStatement() {
    if (this.TagDetailsList.length == 0) {
      this.toastr.info("Please select any row from the table", "Info!")
      this.ChooseBool = true;
    }
    else {
      this.AccountStatementArray = [];
      for (let i = 0; i < this.TagDetailsList.length; i++) {
        let x = this.InvestorDetails.filter((x: { id: any; }) => x.id == this.TagDetailsList[i].UserId)
        this.AccountStatementArray.push({
          InvestorId: x[0].id,
          Name: x[0].fullName,
          Email: x[0].emailId,
        })
      }
      this.AccountStatementPopup = true;
    }
  }

  ViewAccountSummary(val: any) {
    this.AccountStatementDataValue = {
      InvestorId: val.InvestorId,
    }
    this.accountStatementComponent.EditStatement(val)

  }


  onSendEmail() {

  }


}
