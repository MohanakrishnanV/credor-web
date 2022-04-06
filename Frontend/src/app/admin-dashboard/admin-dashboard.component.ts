import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorService } from '../investor/investor.service';
import { LeadService } from '../lead/lead.service';
import { AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  LeadsData: any = [];
  OfferingData: any = [];
  config: any;
  config1: any;
  UserInvestorData: any;
  HeaderSummaryData: any;
  VerifyAccountPopup: boolean = false;
  VerifyPopupShow: boolean = false;
  Loader: boolean = false;
  VerifyAccountId: any;
  UserId: any;
  NotePopup: boolean = false;
  InvestorData: any = [];
  WriteNoteBool: boolean = false;
  InvestorNotes: any;
  EditBool: boolean = false;
  InvestorEmpty: boolean = false;
  InvestorNoteId: any;
  EditInvestorNoteId: any;
  TableView: boolean = false;

  constructor(private adminDashboardService: AdminDashboardService,
    private leadService: LeadService,
    private investorService : InvestorService,
    private route : ActivatedRoute,
    private router: Router) {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.LeadsData.length
    };
    this.config1 = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.OfferingData.length
    };
  }

  ngOnInit(): void {
    this.UserId = Number(localStorage.getItem("UserId"));
    this.Loader = true;
    this.GetLeads();
    this.GetOffering();
    this.GetUserInvestorDetails();
    this.GetAdminHeaderSummary();
  }

  GetLeads() {
    this.adminDashboardService.GetLeads().subscribe(data => {
      this.LeadsData = data;
      console.log(this.LeadsData, 'leads')
      this.Loader = false;
    })
  }

  GetOffering() {
    this.adminDashboardService.GetOffering().subscribe(data => {
      this.OfferingData = data;
      console.log(this.OfferingData, 'this.OfferingData')
    })
  }

  onVerifyAccount(val: any) {
    this.VerifyAccountPopup = true;
    if (val.verifyAccount == true) {
      this.VerifyPopupShow = true;
    }
    else {
      this.VerifyPopupShow = false;
    }
    this.VerifyAccountId = val.id;
    console.log(val, 'verify')
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  pageChanged1(event: any) {
    this.config1.currentPage = event;
  }

  GetUserInvestorDetails() {
    this.adminDashboardService.GetUserInvestorDetails().subscribe(data => {
      this.UserInvestorData = data;
      console.log(this.UserInvestorData, 'UserInvestorData')
    })
  }

  GetAdminHeaderSummary() {
    this.adminDashboardService.GetAdminHeaderSummary().subscribe(data => {
      this.HeaderSummaryData = data;
      console.log(this.HeaderSummaryData, 'this.HeaderSummaryData ')
    })
  }

  VerifyUser() {
    this.Loader = true;
    this.leadService.VerifyAccount(this.UserId, this.VerifyAccountId, this.VerifyPopupShow).subscribe(data => {
      if (data == true) {
        this.VerifyAccountPopup = false;
        this.GetLeads();
      }
      else {
        this.VerifyAccountPopup = false;
        this.Loader = false;
      }
    })
  }

  VerifyCancel() {
    this.VerifyAccountPopup = false;
    let x = this.LeadsData.filter((x: { id: any; }) => x.id == this.VerifyAccountId);
    if (x.length > 0) {
      x[0].verifyAccount = !x[0].verifyAccount
    }
  }

  ProfileReturnData() {
    this.GetLeads();
  }

  onLeadNotes(e : any){
    this.NotePopup = true;
    this.EditBool = false;
    this.InvestorNoteId = e.id;
    this.EditInvestorNoteId = 0;
    this.WriteNoteBool = false;
    this.GetNotesBYId();
  }

  GetNotesBYId() {
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
        this.GetNotesBYId();
      }
      else {
        this.Loader = false;
      }
    })
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
          this.GetNotesBYId();
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
          this.GetNotesBYId();
        }
        else {
          this.Loader = false;
        }
      })
    }
  }

  onWriteANote() {
    this.InvestorEmpty = false;
    this.WriteNoteBool = true;
    this.EditBool = false;
    this.InvestorNotes = '';
  }

  UserNameDetails(e : any){
    console.log(e,'usernamedetails')
    localStorage.setItem("InvestorId",e.id);
    localStorage.setItem("RedirectData","AdminDashboard");
    this.router.navigate(['./../user-details'], { relativeTo: this.route });
  }

}
