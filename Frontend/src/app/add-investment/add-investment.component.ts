import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@aspnet/signalr';
import { ToastrService } from 'ngx-toastr';
import { FileHandle } from '../documents/file.directive';
import { InvestService } from '../invest/invest.service';
import { InvestorService } from '../investor/investor.service';
import { PortfolioService } from '../portfolio/portfolio.service';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.css']
})
export class AddInvestmentComponent implements OnInit {
  @Input() InvestmentData: any;
  @Output() messageEvent = new EventEmitter<string>();
  ModalName: any;
  addInvestmentShow: boolean = false;
  files: any = [];
  InvestmentUserId: any = 0;
  InvestmentStatusId: any = 0;
  AddInvestmentForm: any;
  Loader: boolean = false;
  UserId: any;
  offeringId: any;
  InvestmentProfileId: any = 0;
  filesToUpload: any = [];
  EditInvestmentData: any;
  PortfolioList: any = [];
  InvestmentId: any;
  profileList: any = [];
  UserTypeList: any = [];
  statusList: any = [];
  allowedFileExtensions: any = [];
  allowedFileExtensionsDocument: any = [];
  DocumentPath: any;
  ReservationList: any = [];
  OfferingId: any = 0;
  Marketplace: any = [];
  DropdownOffering: any = [];
  OfferingNameError: boolean = false;
  UserError: boolean = false;
  InvestmentAmountError: boolean = false;
  ProfileTypeError: boolean = false;
  StatusError: boolean = false;
  FundReceivedError: boolean = false;
  DocsSignedError: boolean = false;
  FileUploadError: boolean = false;

  constructor(private _portfolio: PortfolioService,
    private investorService: InvestorService,
    // private httpClient: HttpClient,
    // private router: Router,
    // private route: ActivatedRoute,
    private investService: InvestService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.allowedFileExtensions = ['jpg', 'jpeg', 'png', 'PNG', 'pdf', 'PDF'];
    this.allowedFileExtensionsDocument = ['pdf', 'PDF'];
    this.AddInvestmentForm = this.formBuilder.group({
      NewReservationName: ['', Validators.required],
      InvestmentOfferingType: ['', Validators.required],
      InvestmentUser: ['', Validators.required],
      InvestmentAmount: ['', Validators.required],
      InvestmentProfileType: ['', Validators.required],
      InvestmentStatus: ['', Validators.required],
      InvestmentFundReceived: ['', Validators.required],
      InvestmentDocsSigned: ['', Validators.required],
    });
    this.GetOffering();
    this.getInvestmentUserList();
    this.getInvestmentStatusList();
  }

  onAddInvestment() {
    this.ModalName = 'Add';
    this.addInvestmentShow = true;
    this.files = [];
    this.InvestmentUserId = 0;
    this.InvestmentStatusId = 0;
    this.AddInvestmentForm.reset();
    if (this.InvestmentData != null) {
      if (this.InvestmentData.id != null) {
        this.OfferingId = this.InvestmentData.id;
        this.AddInvestmentForm.get('NewReservationName').disable();
      }
      if (this.InvestmentData.InvestorId != null) {
        this.InvestmentUserId = this.InvestmentData.InvestorId;
        this.onchangeInvestmentUser(this.InvestmentUserId);
        this.AddInvestmentForm.get('InvestmentUser').disable();
      }
    }
    this.OfferingNameError = false;
    this.UserError = false;
    this.InvestmentAmountError = false;
    this.ProfileTypeError = false;
    this.StatusError = false;
    this.FundReceivedError = false;
    this.DocsSignedError = false;
    this.FileUploadError = false;
  }

  onSubmitInvestmentForm() {
    this.Loader = true;
    if (this.OfferingId == 0 || this.InvestmentUserId == 0 || this.AddInvestmentForm.value.InvestmentAmount == '' || this.AddInvestmentForm.value.InvestmentAmount == null ||
      this.AddInvestmentForm.value.InvestmentAmount == 0 || this.InvestmentProfileId == 0 || this.InvestmentStatusId == 0 ||
      this.AddInvestmentForm.value.InvestmentFundReceived == '' || this.AddInvestmentForm.value.InvestmentFundReceived == null ||
      this.AddInvestmentForm.value.InvestmentDocsSigned == '' || this.AddInvestmentForm.value.InvestmentDocsSigned == null || (this.filesToUpload.length == 0 && this.ModalName == 'Add')) {
      this.onChooseReservationName();
      this.onChooseUser();
      this.onMinimumInvestment();
      this.onchangeProfileType();
      this.onchangeStatus();
      this.onchangeFundRecd();
      this.onchangeDocsSign();
      if (this.filesToUpload.length == 0 && this.ModalName == 'Add') {
        this.FileUploadError = true;
      }
      else {
        this.FileUploadError = false;
      }
      this.Loader = false;
    }
    else {
      const InvestmentModel = new FormData();
      this.UserId = Number(localStorage.getItem('UserId'));
      InvestmentModel.append("AdminUserId", this.UserId);
      InvestmentModel.append("UserId", this.InvestmentUserId);
      InvestmentModel.append("OfferingId", this.OfferingId);
      InvestmentModel.append("Amount", this.AddInvestmentForm.value.InvestmentAmount);
      InvestmentModel.append("ProfileId", this.InvestmentProfileId);
      InvestmentModel.append("Status", this.InvestmentStatusId);
      InvestmentModel.append("FundsReceivedDate", this.AddInvestmentForm.value.InvestmentFundReceived);
      InvestmentModel.append("DocumenteSignedDate", this.AddInvestmentForm.value.InvestmentDocsSigned);
      if (this.ModalName == 'Add') {
        if (this.filesToUpload.length == 0) {
          InvestmentModel.append("eSignedDocumentPath", this.EditInvestmentData.eSignedDocumentPath);
        }
        else if (this.filesToUpload.length > 0) {
          this.filesToUpload.forEach((item: any) => {
            InvestmentModel.append('eSignedDocument', item);
          });
          InvestmentModel.append("eSignedDocumentPath", '');
        }
      }
      else {
        if (this.filesToUpload.length == 0) {
          InvestmentModel.append("eSignedDocumentPath", this.EditInvestmentData.eSignedDocumentPath);
        }
        else if (this.filesToUpload.length > 0) {
          this.filesToUpload.forEach((item: any) => {
            InvestmentModel.append('eSignedDocument', item);
          });
          InvestmentModel.append("eSignedDocumentPath", '');
        }
      }
      if (this.ModalName == 'Add') {
        this._portfolio.SaveInvestment(InvestmentModel).subscribe(data => {
          if (data) {
            this.toastr.success("Investment added successfully", "Success");
            this.addInvestmentShow = false;
            this.AddInvestmentForm.reset();
            this.InvestmentUserId = 0;
            this.InvestmentProfileId = 0;
            this.InvestmentStatusId = 0;
            this.messageEvent.emit('Success');
            this.filesToUpload = [];
            this.files = [];
            this.Loader = false;
          }
          else {
            this.Loader = false;
            this.toastr.error("Investment can't be added", "Error");
          }
        })
      }
      else {
        InvestmentModel.append("Id", this.InvestmentId);
        this._portfolio.UpdateInvestment(InvestmentModel).subscribe(data => {
          if (data) {
            this.toastr.success("Investment updated successfully", "Success");
            this.addInvestmentShow = false;
            this.AddInvestmentForm.reset();
            this.InvestmentUserId = 0;
            this.InvestmentProfileId = 0;
            this.InvestmentStatusId = 0;
            this.messageEvent.emit('Success');
            this.filesToUpload = [];
            this.files = [];
            this.Loader = false;
          }
          else {
            this.Loader = false;
            this.toastr.error("Investment can't be updated", "Error");
          }
        })
      }
    }
  }

  EditInvestment(value: any, e: any) {
    if (e == 'Offering') {
      this.OfferingId = this.InvestmentData.id;
      this.AddInvestmentForm.get('NewReservationName').disable();
    }
    else {
      this.AddInvestmentForm.get('InvestmentUser').disable();
    }
    this.ModalName = 'Edit';
    this.addInvestmentShow = true;
    this.EditInvestmentData = value;
    this.InvestmentId = value.id;
    this.OfferingId = value.offeringId;
    this.DocumentPath = value.eSignedDocumentPath;
    this.InvestmentUserId = this.EditInvestmentData.userId;
    this.InvestmentStatusId = this.EditInvestmentData.status;
    if (this.InvestmentUserId != null) {
      this.onchangeInvestmentUser(this.InvestmentUserId);
    }
    this.AddInvestmentForm.patchValue({
      InvestmentAmount: this.EditInvestmentData.amount,
      InvestmentFundReceived: (new Date(this.EditInvestmentData.fundsReceivedDate)).toISOString().substring(0, 10),
      InvestmentDocsSigned: (new Date(this.EditInvestmentData.documenteSignedDate)).toISOString().substring(0, 10),
    })
  }

  getInvestorList() {
    this.Loader = true;
    this.PortfolioList = [];
    let offeringId = this.offeringId;
    this._portfolio.getInvestor(offeringId).subscribe(data => {
      if (data != null) {
        this.PortfolioList = data;
        for (var i = 0; i < this.PortfolioList.length; i++) {
          if (this.PortfolioList[i].status == 1) {
            this.PortfolioList[i].statusName = 'Approved'
          }
          else if (this.PortfolioList[i].status == 2) {
            this.PortfolioList[i].statusName = 'Pending'
          }
          else if (this.PortfolioList[i].status == 3) {
            this.PortfolioList[i].statusName = 'Declined'
          }
          else if (this.PortfolioList[i].status == 4) {
            this.PortfolioList[i].statusName = 'Waitlisted'
          }
          else {
            this.PortfolioList[i].statusName = 'Ownership Sold'
          }
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  onChooseUser() {
    this.onchangeInvestmentUser(this.InvestmentUserId);
    if (this.InvestmentUserId == 0) {
      this.UserError = true;
    }
    else {
      this.UserError = false;
    }
  }

  onchangeInvestmentUser(value: any) {
    let Investorid = Number(value);
    this.profileList = [];
    this._portfolio.getProfileType(Investorid).subscribe(data => {
      if (data) {
        this.profileList = data;
        this.profileList.unshift({
          'id': 0,
          'name': 'Select Profile'
        })
      }
      if (this.ModalName == 'Add') {
        this.InvestmentProfileId = this.InvestmentProfileId;
      }
      else {
        this.InvestmentProfileId = this.EditInvestmentData.profileId;
      }
    })
  }

  onMinimumInvestment() {
    if (this.AddInvestmentForm.value.InvestmentAmount == '' || this.AddInvestmentForm.value.InvestmentAmount == null || this.AddInvestmentForm.value.InvestmentAmount == 0) {
      this.InvestmentAmountError = true;
    }
    else {
      this.InvestmentAmountError = false;
    }
  }

  onchangeFundRecd() {
    if (this.AddInvestmentForm.value.InvestmentFundReceived == '' || this.AddInvestmentForm.value.InvestmentFundReceived == null) {
      this.FundReceivedError = true;
    }
    else {
      this.FundReceivedError = false;
    }
  }
  onchangeDocsSign() {
    if (this.AddInvestmentForm.value.InvestmentDocsSigned == '' || this.AddInvestmentForm.value.InvestmentDocsSigned == null) {
      this.DocsSignedError = true;
    }
    else {
      this.DocsSignedError = false;
    }
  }

  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }

  onFileSelectDrag(files: FileHandle[]) {
    this.filesToUpload = [];
    this.files = [];
    for (var i = 0; i < files.length; i++) {
      let ext: any;
      this.allowedFileExtensions.forEach((element: any) => {
        if (element == files[i].file.name.split('.').pop()) {
          this.filesToUpload.push(files[i].file);
          ext = null;
          var temp: any = {};
          ext = files[i].file.name.split('.').pop();
          const file = files[i];
          const reader = new FileReader();
          reader.readAsDataURL(files[i].file);
              temp.name = files[i].file.name;
              temp.size = files[i].file.size;
              temp.type = files[i].file.type;
              this.files.push(temp);
              this.FileUploadError = false;
        }
      });
      if (ext == null) {
        this.toastr.error(files[i].file.name.split('.').pop() + ' files are not accepted.', 'Error');
        this.FileUploadError = true;
      }
    }
  }

  onchangeProfileType() {
    if (this.InvestmentProfileId == 0) {
      this.ProfileTypeError = true;
    }
    else {
      this.ProfileTypeError = false;
    }
  }

  onFilesSelect(event: any) {
    this.filesToUpload = [];
    this.files = [];
    for (var i = 0; i < event.target.files.length; i++) {
      let ext: any;
      this.allowedFileExtensionsDocument.forEach((element: any) => {
        if (element == event.target.files[i].name.split('.').pop()) {
          this.filesToUpload.push(event.target.files[i]);
          ext = null;
          var temp: any = {};
          ext = event.target.files[i].name.split('.').pop();
          const file = event.target.files[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          temp.name = event.target.files[i].name;
          temp.size = event.target.files[i].size;
          temp.type = event.target.files[i].type;
          this.files.push(temp);
          this.DocumentPath = null;
          this.FileUploadError = false;
        }
      });
      if (ext == null) {
        this.toastr.error(event.target.files[i].name.split('.').pop() + ' files are not accepted.', 'Error');
        this.FileUploadError = true;
      }
    }
  }


  onChooseReservationName() {
    if (this.OfferingId == 0) {
      this.OfferingNameError = true;
    }
    else {
      this.OfferingNameError = false;
    }
  }

  onchangeStatus() {
    if (this.InvestmentStatusId == 0) {
      this.StatusError = true;
    }
    else {
      this.StatusError = false;
    }
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

  getInvestmentStatusList() {
    this._portfolio.getStatusType().subscribe(data => {
      if (data) {
        this.statusList = data;
        this.statusList.unshift({
          'id': 0,
          'name': 'Select'
        })
      }
    })
  }

  GetOffering() {
    this.investService.GetMarketplace().subscribe(data => {
      this.Marketplace = data
      this.DropdownOffering.push({ id: 0, name: 'All Offering' })
      let x = this.Marketplace.filter((x: { active: boolean; isReservation: boolean }) => x.active == true && x.isReservation == false);
      for (let i = 0; i < x.length; i++) {
        this.DropdownOffering.push({ id: x[i].id, name: x[i].name })
      }
    });
  }

}
