import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailEditorComponent } from 'angular-email-editor';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from './email.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  Selected: any;
  addDomainShow: boolean = false;
  domainName: any;
  domainNameError: boolean = false;
  autofocus: boolean = false;
  adminUserId: any;
  domainList: any = [];
  DeleteModalId: any;
  DeleteId: any;
  delConformationShow: boolean = false;
  EmailList: any = [];
  addFromEmailShow: boolean = false;
  ModalName: any;
  FromName: any;
  fromNameError: boolean = false;
  EmailAddress: any;
  emailAddressError: boolean = false;
  EmailDomainList: any = []
  emailDomainId: any = 0;
  autofocus1: boolean = false
  EmailDomainName: any;
  EditEmailId: any;
  TabId: any;
  createTemplateShow: boolean = false;
  newTemplateShow: boolean = false;
  TemplateName: any;
  TemplateNameError: boolean = false;
  TemplateDiscription: any;
  TemplateDiscriptionError: boolean = false;
  CreateEmailTemplateShow: boolean = false;
  CreateId: any;
  emailDesign: any;
  Templatehtml: any;
  TemplateList: any = [];
  delTemplateConformationShow: boolean = false;
  templateValue: any;
  editTemplate: any;
  @ViewChild('editor') emailEditor!: EmailEditorComponent;
  Loader: boolean = false;
  EditId: any = 2;
  TemplateEditValue: any;
  UpdateBtnShow : boolean = false;
  addBtnShow : boolean = false

  constructor(private _email: EmailService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.Selected = 'verifyDomain';
    this.selectVerifyDomainTab(4);
    this.adminUserId = Number(localStorage.getItem('UserId'));
  }

  selectVerifyDomainTab(id: any) {
    this.Selected = 'verifyDomain';
    this.TabId = id;
    this.getDomain();
    this.getEmail();
  }

  selectEmailTemplateTab(id: any) {
    this.Selected = 'emailTemplate';
    this.TabId = id;
    this.getCreateTemplate();
  }

  getDomain() {
    this.domainList = [];
    this.EmailDomainList = [];
    this._email.getDomain().subscribe(data => {
      this.domainList = data;
      if (this.domainList.length > 0) {
        for (var i = 0; i < this.domainList.length; i++) {
          this.EmailDomainList.push({
            'id': this.domainList[i].id,
            'name': this.domainList[i].name
          })
        }
      }
    })
  }

  addDomain() {
    this.addDomainShow = true;
  }

  addDomainCancel() {
    this.addDomainShow = false;
    this.domainNameError = false;
  }

  onDomainName() {
    if (this.domainName == '' || this.domainName == null) {
      this.domainNameError = true;
    }
    else {
      this.domainNameError = false;
    }
  }

  saveDomain() {
    if (this.domainName == '' || this.domainName == null || this.domainNameError == true) {
      this.autofocus = true;
    }
    else {
      let domain: any = {}
      domain.AdminUserId = this.adminUserId;
      domain.Name = this.domainName;
      this._email.saveDomain(domain).subscribe(data => {
        if (data) {
          this.addDomainShow = false;
          this.toastr.success('Domain added successfully.');
          this.getDomain();
        }
        else {
          this.toastr.error('Domain added failed.');
        }
      })
    }
  }

  deleteConformation(value: any, Id: any) {
    this.DeleteModalId = Id;
    this.DeleteId = value.id;
    this.delConformationShow = true;
  }

  DeleteItems() {
    if (this.DeleteModalId == 1) {
      this._email.deleteDomain(this.DeleteId, this.adminUserId).subscribe(data => {
        if (data) {
          this.delConformationShow = false;
          this.toastr.success('Domain deleted successfully.');
          this.getDomain();
        }
        else {
          this.toastr.error('Domain deleted failed.');
        }
      })
    }
    else {
      this._email.deleteEmail(this.DeleteId, this.adminUserId).subscribe(data => {
        if (data) {
          this.delConformationShow = false;
          this.toastr.success('Email deleted successfully.');
          this.getEmail();
        }
        else {
          this.toastr.error('Email deleted failed.');
        }
      })
    }

  }

  addEmail() {
    this.ModalName = 'Add';
    this.addFromEmailShow = true;
    this.FromName = '';
    this.EmailAddress = '';
    this.emailDomainId = this.EmailDomainList[0].id;
  }

  addEmailCancel() {
    this.addFromEmailShow = false;
  }

  onFromName() {
    if (this.FromName == '' || this.FromName == null) {
      this.fromNameError = true;
    }
    else {
      this.fromNameError = false;
    }
  }

  onEmailAddress() {
    if (this.EmailAddress == '' || this.EmailAddress == null) {
      this.emailAddressError = true;
    }
    else {
      this.emailAddressError = false;
    }
  }

  onchangeEmailMethod(e: any) {
    for (var i = 0; i < this.EmailDomainList.length; i++) {
      if (e.target.value == this.EmailDomainList[i].id) {
        this.emailDomainId = this.EmailDomainList[i].id;
        this.EmailDomainName = this.EmailDomainList[i].name;
      }
    }
  }

  getEmail() {
    this.EmailList = [];
    this._email.getEmail().subscribe(data => {
      this.EmailList = data;
    })
  }

  saveEmail() {
    if (this.FromName == '' || this.FromName == null || this.fromNameError == true) {
      this.autofocus = true;
    }
    else if (this.EmailAddress == '' || this.emailAddressError == true || this.EmailAddress == null) {
      this.autofocus1 = true;
    }
    else {
      let email: any = {}
      email.AdminUserId = this.adminUserId;
      email.FromName = this.FromName;
      if (this.EmailDomainName == undefined) {
        if (this.EmailDomainList[0].id) {
          this.emailDomainId = this.EmailDomainList[0].id;
          this.EmailDomainName = this.EmailDomainList[0].name;
        }
      }
      email.EmailId = this.EmailAddress + '@' + this.EmailDomainName;
      email.DomainId = this.emailDomainId;
      if (this.ModalName == 'Update') {
        email.Id = this.EditEmailId;
        this._email.editEmail(email).subscribe(data => {
          if (data) {
            this.addFromEmailShow = false;
            this.toastr.success('Email updated successfully.');
            this.getEmail();
          }
          else {
            this.toastr.error('Email updated failed.');
          }
        })
      }
      else {
        this._email.saveEmail(email).subscribe(data => {
          if (data) {
            this.addFromEmailShow = false;
            this.toastr.success('Email added successfully.');
            this.getEmail();
          }
          else {
            this.toastr.error('Email added failed.');
          }
        })
      }
    }
  }

  EditEmail(value: any) {
    this.addFromEmailShow = true;
    this.ModalName = 'Update'
    this.FromName = value.fromName;
    let email = value.emailId.split('@');
    this.EmailAddress = email[0];
    this.emailDomainId = value.domainId;
    this.EditEmailId = value.id;
  }

  CreateTemplate() {
    this.createTemplateShow = true;
    this.newTemplateShow = false;
    this.emailDesign = undefined;
    this.TemplateName = '';
    this.TemplateDiscription = '';
  }

  createNewTemplate() {
    this.newTemplateShow = true;
    this.createTemplateShow = false;
    this.CreateEmailTemplateShow = false;
    this.emailDesign = undefined;
    this.TemplateName = '';
    this.TemplateDiscription = '';
    this.addBtnShow = false;
    this.UpdateBtnShow = false;
  }

  onTemplateName() {
    if (this.TemplateName == '' || this.TemplateName == null) {
      this.TemplateNameError = true;
    }
    else {
      this.TemplateNameError = false;
    }
  }

  onTemplateDiscription() {
    if (this.TemplateDiscription == '' || this.TemplateDiscription == null) {
      this.TemplateDiscriptionError = true;
    }
    else {
      this.TemplateDiscriptionError = false;
    }
  }

  addTemplate() {
    if (this.TemplateName == '' || this.TemplateName == null) {
      this.TemplateNameError = true;
    }
    else {
      this.TemplateNameError = false;
    }
    if (this.TemplateDiscription == '' || this.TemplateDiscription == null) {
      this.TemplateDiscriptionError = true;
    }
    else {
      this.TemplateDiscriptionError = false;
    }
    if (this.TemplateNameError == false && this.TemplateDiscriptionError == false) {
      this.CreateEmailTemplateShow = true;
      //this.EditId = 0;
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

  // called when the editor is loading
  editorLoaded(e: any) {
    if (this.emailEditor != undefined) {
      console.log(this.emailEditor, '3')
    }
    else {
      this.emailEditor = new EmailEditorComponent();
    }
  }


  saveDesign() {
    if(this.EditId == 1){
      this.UpdateBtnShow = true;
    }
    else{
      this.addBtnShow = true;
    }
    this.Loader = true;
    let email: any = {};
    email.AdminUserId = this.adminUserId;
    if (this.EditId == 1) {
      email.Id = this.TemplateEditValue.id;
      email.Name = this.TemplateEditValue.name;
      email.Description = this.TemplateEditValue.description;
    }
    else {
      email.Name = this.TemplateName;
      email.Description = this.TemplateDiscription;
    }
    this.emailEditor.exportHtml(function (data) {
      let emailvalue: any = {};
      emailvalue = data;
      var json = emailvalue.design; // design json
      var html = emailvalue.html; // final html
      email.Template = html;
      email.TemplateDesign = json;
    });

    this.emailEditor.editor.saveDesign((data: any) => {
      localStorage.setItem('testData', JSON.stringify(data));
      email.Design = JSON.stringify(data);
    }

    );
    this.Templatehtml = email;
    this.Loader = false;
  }

  save() {
    this.Loader = true;
    this._email.saveTemplate(this.Templatehtml).subscribe((data: any) => {
      if (data) {
        this.CreateEmailTemplateShow = false;
        this.newTemplateShow = false;
        this.getCreateTemplate();
        this.toastr.success('Template saved successfully.');
      }
      else {
        this.Loader = false;
        this.toastr.error('Template saved failed.');
      }
    })
  }

  Update() {
    this.Loader = true;
    this._email.updateTemplate(this.Templatehtml).subscribe((data: any) => {
      if (data) {
        this.CreateEmailTemplateShow = false;
        this.newTemplateShow = false;
        this.getCreateTemplate();
        this.toastr.success('Template updated successfully.');
      }
      else {
        this.Loader = false;
        this.toastr.error('Template updated failed.');
      }
    })
  }

  getCreateTemplate() {
    this.Loader = true;
    this._email.getTemplates().subscribe(data => {
      if (data) {
        this.TemplateList = data;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  templateDelete(value: any) {
    this.delTemplateConformationShow = true;
    this.templateValue = value;
  }

  DeleteTemplateItems() {
    this._email.deleteTemplate(this.templateValue.id, this.adminUserId).subscribe(data => {
      if (data) {
        this.delTemplateConformationShow = false;
        this.toastr.success('Template deleted successfully.');
        this.getCreateTemplate();
      }
      else {
        this.toastr.error('Template deleted failed.');
      }
    })
  }

  templateEdit(value: any , id : any) {
    this.EditId = id;
    this.CreateEmailTemplateShow = true;
    this.newTemplateShow = true;
    this.emailDesign = value.design;
    this.TemplateEditValue = value;
    this.addBtnShow = false;
    this.UpdateBtnShow = false;
  }

  selectSendEmailTab(id: any) {
    this.Selected = 'sendEmail';
    this.TabId = id;
  }

  selectmanageTemplateTab(id: any) {
    this.Selected = 'manageEmails';
    this.TabId = id;
  }
}
