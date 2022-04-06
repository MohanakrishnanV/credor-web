import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { ToastrService } from 'ngx-toastr';
import { SendEmailService } from './send-email.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  SubjectName: any;
  subjectNameError: boolean = false;
  RecipientList: any = [];
  RecipientId: any = 0;
  RecipientError: boolean = false;
  RecipientFromName: any;
  RecipientFromEmailId: any = 0;
  EmailList: any = [];
  RecipientReplyTo: any;
  RecipientEmailTypeId: any = 0;
  EmailTypeList: any = [];
  RecipientEmailTypeError: boolean = false;
  RecipientReplyToError: boolean = false;
  RecipientFromEmailError: boolean = false;
  RecipientFromNameError: boolean = false;
  @ViewChild('editor') emailEditor!: EmailEditorComponent;
  emailDesign: any;
  savedTemplateShow: boolean = false;
  TemplateList: any = [];
  showEditior: boolean = true;
  filesToUpload: any = [];
  files: any = [];
  allowedFileExtensionsDocument: any = [];
  adminUserId: any;
  value: any;
  EmailTemplateId: any;
  Id: any = [];
  SelectList: any = [];
  successShow: boolean = false;
  SaveId: any;
  SendBtnsShow: boolean = false;

  constructor(private _email: SendEmailService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.allowedFileExtensionsDocument = ['jpeg', 'JPEG', 'jpg'];
    this.adminUserId = Number(localStorage.getItem('UserId'));
    this.getRecipients();
    this.getFromEmail();
    this.getEmailType();
  }

  getRecipients() {
    this._email.getRecipients().subscribe(data => {
      if (data) {
        this.RecipientList = data;
        this.RecipientList.push({
          'id': 0,
          'name': 'Select'
        })
        console.log('RecipientList', data)
      }
    })
  }

  getFromEmail() {
    this._email.getfromemail().subscribe(data => {
      if (data) {
        this.EmailList = data;
        console.log('EmailList', data)
        this.EmailList.push({
          'id': 0,
          'emailId': 'Select Email'
        })
      }
    })
  }

  getEmailType() {
    this._email.getEmailType().subscribe(data => {
      if (data) {
        this.EmailTypeList = data;
        console.log('EmailTypeList', data)
        this.EmailTypeList.push({
          'id': 0,
          'name': 'Select Email'
        })
      }
    })
  }

  onSubjectName() {
    if (this.SubjectName == '' || this.SubjectName == null) {
      this.subjectNameError = true;
    }
    else {
      this.subjectNameError = false;
    }
  }

  onReplyTo() {
    if (this.RecipientReplyTo == '' || this.RecipientReplyTo == null) {
      this.RecipientReplyToError = true;
    }
    else {
      this.RecipientReplyToError = false;
    }
  }

  onFromName() {
    if (this.RecipientFromName == '' || this.RecipientFromName == null) {
      this.RecipientFromNameError = true;
    }
    else {
      this.RecipientFromNameError = false;
    }
  }

  onchangeRecipients(e: any) {
    debugger
    let a = e.target.value;
    let value1 = a.substring(a.indexOf(":") + 1);
    // let value2 =  value1.replace(/ +(?=[^']*'$)/g, "");
    let value2 = value1.replace(/'/g, '');
    let value3 = value2.trim().toLowerCase()
    this.RecipientId = value3
    if (this.RecipientId == 0) {
      this.RecipientError = true;
    }
    else {
      this.Id.push({ Id: this.RecipientId })
      this.RecipientError = false;
      console.log('ID', this.Id)
    }
  }


  onchangeEmailType(e: any) {
    this.RecipientEmailTypeId = +e.target.value;
    if (this.RecipientEmailTypeId == 0) {
      this.RecipientEmailTypeError = true;
    }
    else {
      this.RecipientEmailTypeError = false;
    }
  }

  onchangeFromEmail(e: any) {
    if (e.target.value == 0) {
      this.RecipientFromEmailError = true;
    }
    else {
      this.RecipientFromEmailError = false;
      for (var i = 0; i < this.EmailList.length; i++) {
        if (this.EmailList[i].id == e.target.value) {
          this.RecipientFromName = this.EmailList[i].fromName;
          this.RecipientReplyTo = 'Test';
        }
      }
    }
  }

  // called when the editor is loading
  editorLoaded(e: any) {
    if (this.emailEditor != undefined) {
      console.log(this.emailEditor, '3')
    }
    else {
      this.emailEditor = new EmailEditorComponent();
    }
  }

  // called when the editor has finished loading
  editorReady(e: any) {
    if (this.emailDesign != undefined) {
      this.emailEditor.editor.loadDesign(JSON.parse(this.emailDesign))
    }
    else {
      this.emailEditor.editor.loadDesign(this.emailDesign);
    }
  }

  showSavedTemplate() {
    this.savedTemplateShow = true;
    this.showEditior = false;
    this.getCreatedTemplate();
  }

  cancelSavedTemplate() {
    this.savedTemplateShow = false;
    this.showEditior = true;
    this.emailDesign = undefined;
  }

  getCreatedTemplate() {
    this._email.getTemplates().subscribe(data => {
      if (data) {
        this.TemplateList = data;
      }
      else {
      }
    })
  }

  useTemplate(value: any) {
    this.showEditior = true;
    this.savedTemplateShow = false;
    this.emailDesign = value.design;
    this.EmailTemplateId = value.id;
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
        }
      });
      if (ext == null) {
        this.toastr.error(event.target.files[i].name.split('.').pop() + ' files are not accepted.', 'Error');
      }
    }
  }

  sendEmailNow() {
    var t: any;
    console.log('this.Id', this.Id)
    const email = new FormData();
    email.append("AdminUserId", this.adminUserId);
    email.append("FromName", this.RecipientFromName);
    email.append("ReplyTo", this.RecipientReplyTo);
    email.append("FromEmailAddressId", this.RecipientFromEmailId);
    email.append("Subject", this.SubjectName);
    email.append("EmailTypeId", this.RecipientEmailTypeId);
    email.append("FromEmail", 'prakash.madhusudhanan@excelenciaconsulting.com');
    this.filesToUpload.forEach((item: any) => {
      email.append('Attachments', item);
    });
    for (let i = 0; i < this.Id.length; i++) {
      this.SelectList.push(this.Id[i].Id)
    }
    email.append("EmailRecipientGroups", this.SelectList);
    console.log('SelectList', this.SelectList)
    email.append("EmailTemplateId", this.EmailTemplateId);
    this.emailEditor.exportHtml(function (data) {
      let emailvalue: any = {};
      emailvalue = data;
      var json = emailvalue.design; // design json
      var html = emailvalue.html; // final html
      t = html;
      console.log('t', t)
      email.append("Template", t);
    });
    console.log('email', email)
    this.value = email;
    this.SendBtnsShow = true;
  }

  save(Id: any) {
    this.SaveId = Id;
    if (Id == 2) {
      this.value.append("IsTestMail", true);
    }
    else if (Id == 3) {
      this.value.append("IsScheduled", true);
    }
    else if (Id == 4) {
      this.value.append("IsDraft", true);
    }
    this._email.SendEmail(this.value).subscribe(data => {
      console.log('SendEmail', data)
      if (data != null) {
        this.SendBtnsShow = false;
        this.successShow = true;
      }
    })
  }

  ClosesuccessPopup() {
    this.successShow = false;
    this.SubjectName = '';
    this.RecipientId = 0;
    this.RecipientFromName = '';
    this.RecipientFromEmailId = 0;
    this.RecipientReplyTo = '';
    this.RecipientEmailTypeId = 0;
    this.emailDesign = '';
    this.SendBtnsShow = false;
  }
}


