import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportService } from './report.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  Selected: any;
  tabSelectId: any;
  ReportList: any = [];
  adminUserId: any;
  viewNotesBtnShow: boolean = false;
  NotesList: any = [];
  Loader: boolean = false;
  config: any;
  @ViewChild('tableInput') tableInput!: ElementRef;
  StatusTypeId: any = 0;
  ReportSearchList: any = [];
  NameTypeId: any = 0;
  OfferingNameList: any = [];
  FromDate: any;
  ToDate: any;
  TaxFromDate: any;
  TaxToDate: any;
  TaxofferingId: any = 0;
  FormDOfferingId: any = 0;

  StatusList: any = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Lead' },
    { id: 2, value: 'Investor' },
  ];

  constructor(private _report: ReportService, public datepipe: DatePipe) {
    this.config = {
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: this.ReportList.length
    };
  }

  ngOnInit(): void {
    this.adminUserId = Number(localStorage.getItem('UserId'));
    this.selectUserTab(1);
    this.getOfferingName();
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  selectUserTab(id: any) {
    this.FromDate = '';
    this.ToDate = '';
    this.Selected = 'Users';
    this.tabSelectId = id;
    this.getUserList();
  }

  selectInvestmentTab(id: any) {
    this.NameTypeId = 0;
    this.Selected = 'Investments';
    this.tabSelectId = id;
    this.getInvestmentList();
  }

  selectDistributionTab(id: any) {
    this.NameTypeId = 0;
    this.Selected = 'Distributions';
    this.tabSelectId = id;
    this.getDistributionList();
  }

  selectTaxTab(id: any) {
    this.TaxofferingId = 0;
    this.ReportList = [];
    this.NameTypeId = 0;
    this.Selected = 'Tax';
    this.tabSelectId = id;
  }

  selectFormDTab(id: any) {
    this.FormDOfferingId = 0;
    this.ReportList = [];
    this.NameTypeId = 0;
    this.Selected = 'FormD';
    this.tabSelectId = id;
  }

  selectInvestorProfileTab(id: any) {
    this.ReportList = [];
    this.NameTypeId = 0;
    this.Selected = 'InvestorProfileUpdates';
    this.tabSelectId = id;
  }

  getUserList() {
    this.StatusTypeId = 0;
    this.Loader = true;
    this.ReportList = [];
    this.ReportSearchList = [];
    this._report.getReportUser(this.adminUserId).subscribe(data => {
      if (data) {
        this.ReportList = data;
        this.ReportSearchList = data;
        for (var i = 0; i < this.ReportSearchList.length; i++) {
          //   var date = new Date(this.ReportSearchList[i].createdOn);
          this.ReportSearchList[i].createdOn = this.datepipe.transform(this.ReportSearchList[i].createdOn, 'yyyy-MM-dd');
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  getOfferingName() {
    this.Loader = true;
    this._report.GetPortfolioOfferings().subscribe(data => {
      if (data != null) {
        this.OfferingNameList = data;
        this.OfferingNameList.unshift({
          'id': 0,
          'name': 'Select'
        })
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  getInvestmentList() {
    this.Loader = true;
    this.ReportList = [];
    this.ReportSearchList = [];
    this._report.getInvestment(this.adminUserId).subscribe(data => {
      if (data) {
        this.ReportList = data;
        this.ReportSearchList = data;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  getDistributionList() {
    this.Loader = true;
    this.ReportList = [];
    this.ReportSearchList = [];
    this._report.getDistribution().subscribe(data => {
      if (data) {
        this.ReportList = data;
        this.ReportSearchList = data;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  onchangeTaxType(e: any) {
    this.Loader = true;
    this._report.GetTax(e.target.value).subscribe(data => {
      if (data != null) {
        this.ReportList = data;
        this.ReportSearchList = data;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  onchangeFormDType(e: any) {
    this.Loader = true;
    this._report.GetFormD(e.target.value).subscribe(data => {
      if (data != null) {
        this.ReportList = data;
        this.ReportSearchList = data;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })

  }

  onViewNotes(value: any) {
    this.viewNotesBtnShow = true;
    this.NotesList = value;
  }

  ExcelTableExport() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableInput.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    if (this.Selected == 'Users') {
      XLSX.writeFile(wb, 'UserReports.xlsx');
    }
    else if (this.Selected == 'Investments') {
      XLSX.writeFile(wb, 'InvestmentsReports.xlsx');
    }
    else if (this.Selected == 'Distributions') {
      XLSX.writeFile(wb, 'DistributionsReports.xlsx');
    }
    else if(this.Selected == 'Tax'){
      XLSX.writeFile(wb, 'TaxReports.xlsx');
    }
    else if(this.Selected == 'FormD'){
      XLSX.writeFile(wb, 'FormDReports.xlsx');
    }
  }

  onchangeNameType(e: any) {
    let ChangeName: any;
    for (var i = 0; i < this.OfferingNameList.length; i++) {
      if (e.target.value == this.OfferingNameList[i].id) {
        ChangeName = this.OfferingNameList[i].name;
        this.ReportList = [];
        const List = this.ReportSearchList.filter((x: any) => x.offeringName == ChangeName);
        this.ReportList = List
      }
    }
  }

  onchangeStatusType(e: any) {
    if (e.target.value == 1) {
      const statusList = this.ReportSearchList.filter((x: any) => x.status == 'Lead');
      this.ReportList = [];
      this.ReportList = statusList;
    }
    else if (e.target.value == 2) {
      const statusList = this.ReportSearchList.filter((x: any) => x.status == 'Investor');
      this.ReportList = [];
      this.ReportList = statusList;
    }
    else {
      this.ReportList = [];
      this.ReportList = this.ReportSearchList;
    }
  }

  SearchDate() {
    let StartDate: any;
    let EndDate: any;
    if ((this.FromDate != null || this.FromDate != "") && (this.ToDate == null || this.ToDate == "")) {
      StartDate = this.datepipe.transform(this.FromDate, 'yyyy-MM-dd')
      var resultProductData = this.ReportSearchList.filter((a: any) => a.createdOn >= StartDate);
      this.ReportList = [];
      this.ReportList = resultProductData;
    }
    else if ((this.FromDate == null || this.FromDate == "") && (this.ToDate != null || this.ToDate != "")) {
      EndDate = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd')
      var resultProductData = this.ReportSearchList.filter((a: any) => a.createdOn >= EndDate);
      this.ReportList = [];
      this.ReportList = resultProductData;
    }
    else {
      StartDate = this.datepipe.transform(this.FromDate, 'yyyy-MM-dd')
      EndDate = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd')
      var resultProductData = this.ReportSearchList.filter((a: any) => (a.createdOn >= StartDate && a.createdOn <= EndDate));
      this.ReportList = [];
      this.ReportList = resultProductData;
    }
  }
}
