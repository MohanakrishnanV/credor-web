import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ManageEmailService } from './manage-email.service';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { SendEmailComponent } from '../send-email/send-email.component';
import { ToastrService } from 'ngx-toastr';
import { timeStamp } from 'console';

@Component({
  selector: 'app-manage-email',
  templateUrl: './manage-email.component.html',
  styleUrls: ['./manage-email.component.css']
})
export class ManageEmailComponent implements OnInit {
  Selected: any;
  TabId: any;
  sendSelected: any;
  emailList: any = [];
  manageEmailList: any = [];
  config: any;
  NotificationList: any = [];
  SystemNotificationList: any = [];
  SystemId: any;
  showSendEmailDetails: boolean = false;
  credorEmailDetail: any = {};
  SubjectName: any;
  emailRecipientGroups: any = [];
  emailAttachments: any = [];
  credorEmails: any = [];
  @ViewChild('tableInput') tableInput!: ElementRef;
  EmailGroupList: any = [];
  showPreview: boolean = false;
  emailTemplate: any;
  showEditEmail: boolean = false;
  @ViewChild(SendEmailComponent) sendMailComponent: any;
  message: any;
  parentMessage: any;
  delDraftConformationShow: boolean = false;
  deleteId: any = [];
  adminUserId: any;
  MultideleteId: any = [];
  MultiArchiveId: any = [];
  EditTabId : any;

  constructor(private _manageEmail: ManageEmailService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute,) {
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.manageEmailList.length
    };
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.SystemNotificationList.length
    };
  }

  ngOnInit(): void {
    this.router.navigate([], {
      queryParams: {
        'id': null,
      },
      queryParamsHandling: 'merge'
    })
    this.getEmailDetails();
    this.getSystemNotifications();
    this.adminUserId = Number(localStorage.getItem('UserId'));
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  getEmailDetails() {
    this._manageEmail.getEmails().subscribe(data => {
      if (data) {
        this.emailList = data;
        this.selectSendTab(1);
        console.log('emailList:', data)
      }
    })
  }

  getSystemNotifications() {
    this.NotificationList = [];
    this._manageEmail.getSystemNotification().subscribe(data => {
      if (data) {
        this.NotificationList = data;
        if (this.TabId == 1) {
          this.SystemNotificationList = this.NotificationList.filter((x: any) => x.status == 2)
        }
        else {
          this.SystemNotificationList = this.NotificationList.filter((x: any) => x.status == 3)
        }
        console.log('getSystemNotifications', data)
      }
    })
  }

  selectSendTab(id: any) {
    this.TabId = id;
    this.SystemId = 1;
    this.Selected = 'send';
    this.sendSelected = 'sendEmail';
    this.manageEmailList = this.emailList.filter((x: any) => x.status == 2)
    console.log('SendmanageEmailList', this.manageEmailList)
  }

  selectDraftTab(id: any) {
    this.TabId = id;
    this.Selected = 'draft';
    this.manageEmailList = this.emailList.filter((x: any) => x.status == 1)
    console.log('DraftmanageEmailList', this.manageEmailList)
  }

  selectArchiveTab(id: any) {
    this.TabId = id;
    this.SystemId = 1;
    this.Selected = 'archive';
    this.manageEmailList = this.emailList.filter((x: any) => x.status == 3)
    console.log('ArchivemanageEmailList', this.manageEmailList)
  }

  selectBounceTab(id: any) {
    this.TabId = id;
    this.Selected = 'bounceEmails';
  }

  selectSendEmailTab(id: any) {
    this.SystemId = id;
    this.sendSelected = 'sendEmail';
  }

  selectSendNotificationTab(id: any) {
    this.SystemId = id;
    this.SystemNotificationList = [];
    this.sendSelected = 'sendNotification';
    if (this.TabId == 1) {
      this.SystemNotificationList = this.NotificationList.filter((x: any) => x.status == 2)
    }
    else {
      this.SystemNotificationList = this.NotificationList.filter((x: any) => x.status == 3)
    }
    console.log('SystemNotificationList', this.SystemNotificationList)
  }

  ViewSendDetails(value: any) {
    this.showSendEmailDetails = true;
    this._manageEmail.getSendEmailDetails(value.id).subscribe(data => {
      if (data) {
        let a: any = {};
        a = data;
        this.credorEmailDetail = a.credorEmailDetail;
        this.emailRecipientGroups = a.emailRecipientGroups;
        this.emailAttachments = a.emailAttachments;
        this.credorEmails = a.credorEmails;
        this.EmailGroupList = this.emailRecipientGroups.filter((x: any) => x.emailRecipientGroupName == null)
        console.log('getSendEmailDetails', data)
      }
    })
  }

  ExcelTableExport() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableInput.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Campaign.xlsx');
  }

  PreviewEmail(value: any) {
    console.log('PreviewSentEmail', value)
    this.showPreview = true;
    this.emailTemplate = value.emailTemplate != null ? value.emailTemplate : value.body;
  }

  editEmail(value: any, tabId : any) {
    this.showEditEmail = true;
    this.EditTabId = tabId;
    this.parentMessage = value.id;
    //this.message = this.sendMailComponent.childMessage
  }

  deleteDraftEmail(value: any) {
    this.deleteId.push(value.id);
    this.delDraftConformationShow = true;
  }

  DeleteDraftItems() {
    let value: any = {};
    if (this.MultideleteId.length > 0) {
      value.CredorEmailDetailIds = this.MultideleteId;
    }
    else {
      value.CredorEmailDetailIds = this.deleteId;
    }
    value.AdminUserId = this.adminUserId;
    console.log('DeleteDraftItems', value)
    this._manageEmail.deleteDraftEmail(value).subscribe(data => {
      if (data) {
        this.delDraftConformationShow = false;
        this.MultideleteId = [];
        this.deleteId = [];
        this.getDraftEmailDetails();
        this.toastr.success('Mail deleted successfully');
      }
      else {
        this.toastr.error('Mail deleted failed');
      }
    })
  }

  getDraftEmailDetails() {
    this._manageEmail.getEmails().subscribe(data => {
      if (data) {
        this.emailList = data;
        this.selectDraftTab(2)
        console.log('emailList:', data)
      }
    })
  }

  onCheckboxChange(e: any, id: any) {
    let listId: any = [];
    if (e.target.checked) {
      this.MultideleteId.push(id);
    }
    else {
      listId = this.MultideleteId.filter((x: any) => x != id);
      this.MultideleteId = listId;
    }
  }

  deleteMultiDraftEmail() {
    this.delDraftConformationShow = true;
  }

  cancelDeleteDraftItems() {
    this.deleteId = []
  }

  sentEmail(value: any) {
    this._manageEmail.resentDraftEmail(value.id, this.adminUserId).subscribe(data => {
      if (data) {
        this.toastr.success('Mail sended successfully');
      }
      else {
        this.toastr.error('Mail sended failed')
      }
    })
  }

  onCheckboxsentmailChange(e: any, id: any) {
    let listId: any = [];
    if (e.target.checked) {
      this.MultiArchiveId.push(id);
    }
    else {
      listId = this.MultiArchiveId.filter((x: any) => x != id);
      this.MultiArchiveId = listId;
    }
  }

  archiveMultiEmail() {
    let value: any = {};
    value.CredorEmailDetailIds = this.MultiArchiveId;
    value.AdminUserId = this.adminUserId;
    this._manageEmail.archivesentEmail(value).subscribe(data => {
      if (data) {
        this.getEmailDetails();
        this.toastr.success('Mail archive successfully');
        this.MultiArchiveId = [];
      }
      else {
        this.toastr.error('Mail archive failed');
      }
    })
  }

  receiveMessage() {
  this.showEditEmail = false;
  this.getDraftArchiveEmailDetails();
  }

  getDraftArchiveEmailDetails() {
    this._manageEmail.getEmails().subscribe(data => {
      if (data) {
        this.emailList = data;
        if(this.EditTabId == 1){
          this.selectDraftTab(2);
        }
        else{
          this.selectArchiveTab(3);
        }
      }
    })
  }
}
