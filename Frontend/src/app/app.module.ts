import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { HttpClientModule } from 'ngx-http-client';
import { InvestComponent } from './invest/invest.component';
import { InvestmentComponent } from './investment/investment.component';
import { HeaderComponent } from './header/header.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvestorProfileComponent } from './investor-profile/investor-profile.component';
import { MyinvestmentComponent } from './myinvestment/myinvestment.component';
import { UpdatesComponent } from './updates/updates.component';
import { DistributionsComponent } from './distributions/distributions.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DocumentsComponent } from './documents/documents.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from "swiper/angular";
import SwiperCore, { Pagination, Navigation } from "swiper";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AccountComponent } from './account/account.component';
import { DragDirective } from './documents/file.directive';
import { NgOtpInputModule } from 'ng-otp-input';
import { SignupComponent } from './signup/signup.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { LeadComponent } from './lead/lead.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { InvestorComponent } from './investor/investor.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { EmailComponent } from './email/email.component';
import { ReportsComponent } from './reports/reports.component';
import { PaymentComponent } from './payment/payment.component';
import { ServicesComponent } from './services/services.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AgmCoreModule } from '@agm/core';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import * as XLSX from 'xlsx';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { AddBankaccountComponent } from './add-bankaccount/add-bankaccount.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { AddReservationComponent } from './add-reservation/add-reservation.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddInvestmentComponent } from './add-investment/add-investment.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { AutoFocusDirective } from './Directives/auto-focus.directive';
import { NgChartsModule } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { SiteLayoutComponent } from './_Layout/site-layout/site-layout.component';
import { AppLayoutComponent } from './_Layout/app-layout/app-layout.component';
import { EmailEditorComponent, EmailEditorModule } from 'angular-email-editor';
import { SafeHtmlPipe } from './SafeHtml';
import { HighchartsChartModule } from 'highcharts-angular';
import { SortDirective } from './sort.directive';
import { ViewUpdatesComponent } from './view-updates/view-updates.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { SendEmailComponent } from './emailTabs/send-email/send-email.component';
import { SettingsComponent } from './settings/settings.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ManageEmailComponent } from './emailTabs/manage-email/manage-email.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ViewUserDetailsComponent } from './view-user-details/view-user-details.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';




SwiperCore.use([Pagination, Navigation]);
const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'resetlogin', component: LoginComponent },
      { path: 'forgot-password', component: ForgotpasswordComponent },
      { path: 'reset-password', component: ResetpasswordComponent },
      { path: 'reset-password/:token', component: ResetpasswordComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'signup/:id:token', component: SignupComponent },
      { path: 'privacy-policy', component: PrivacypolicyComponent },
      { path: 'terms-and-conditions', component: TermsandconditionsComponent },
      // { path : 'view-details/:id',component : ViewDetailsComponent}
    ]
  },
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      { path: 'invest', component: InvestComponent },
      { path: 'investment', component: InvestmentComponent },
      { path: 'investment/:id', component: InvestmentComponent },
      { path: 'investment/:id/:offId/:name', component: InvestmentComponent },
      { path: 'investor-profile', component: InvestorProfileComponent },
      { path: 'myinvestment', component: MyinvestmentComponent },
      { path: 'update', component: UpdatesComponent },
      { path: 'distribution', component: DistributionsComponent },
      { path: 'document', component: DocumentsComponent },
      { path: 'account', component: AccountComponent },
      { path: 'otp-verification', component: OtpVerificationComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'lead', component: LeadComponent },
      { path: 'investor', component: InvestorComponent },
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'portfolio/:name/:id', component: PortfolioComponent },
      { path: 'portfolio-details/:name/:id', component: PortfolioDetailsComponent },
      { path: 'email', component: EmailComponent },
      { path: 'report', component: ReportsComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'service', component: ServicesComponent },
      { path: 'privacy-policy', component: PrivacypolicyComponent },
      { path: 'terms-and-conditions', component: TermsandconditionsComponent },
      {path : 'settings',component : SettingsComponent},
      {path : 'email/:id',component : EmailComponent},
      {path : 'user-details',component : ViewUserDetailsComponent}
    ]
  },

  // App routes goes here here


  // { path: '', redirectTo: '/login', pathMatch: 'full' }
  { path: 'view-details/:id', component: ViewDetailsComponent },
  // { path: 'resetlogin', component: LoginComponent },
  // { path: 'forgot-password', component: ForgotpasswordComponent },
  // { path: 'reset-password', component: ResetpasswordComponent },
  // { path: 'reset-password/:token', component: ResetpasswordComponent },
  // { path: 'register', component: RegisterComponent },
  // { path: 'invest', component: InvestComponent },
  // { path: 'investor-profile', component: InvestorProfileComponent },
  // { path: 'myinvestment', component: MyinvestmentComponent },
  // { path: 'update', component: UpdatesComponent },
  // { path: 'distribution', component: DistributionsComponent },
  // { path: 'document', component: DocumentsComponent },
  // { path: 'account', component: AccountComponent },
  // { path: 'signup/:id:token', component: SignupComponent },
  // { path: 'otp-verification', component: OtpVerificationComponent },
  // { path: 'admin-dashboard', component: AdminDashboardComponent },
  // { path: 'lead', component: LeadComponent },
  // { path: 'investor', component: InvestorComponent },
  // { path: 'portfolio', component: PortfolioComponent },
  // { path: 'portfolio/:name/:id', component: PortfolioComponent },
  // { path: 'portfolio-details/:name/:id', component: PortfolioDetailsComponent },
  // { path: 'email', component: EmailComponent },
  // { path: 'report', component: ReportsComponent },
  // { path: 'payment', component: PaymentComponent },
  // { path: 'service', component: ServicesComponent },
  // { path: 'privacy-policy', component: PrivacypolicyComponent },
  // { path: 'terms-and-conditions', component: TermsandconditionsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    InvestmentComponent,
    InvestComponent,
    HeaderComponent,
    InvestorProfileComponent,
    MyinvestmentComponent,
    UpdatesComponent,
    DistributionsComponent,
    SideBarComponent,
    DocumentsComponent,
    AccountComponent,
    DragDirective,
    SignupComponent,
    OtpVerificationComponent,
    LeadComponent,
    AdminDashboardComponent,
    InvestorComponent,
    PortfolioComponent,
    EmailComponent,
    ReportsComponent,
    PaymentComponent,
    ServicesComponent,
    TermsandconditionsComponent,
    PrivacypolicyComponent,
    PortfolioDetailsComponent,
    AddProfileComponent,
    AddBankaccountComponent,
    ViewDetailsComponent,
    AddReservationComponent,
    AddInvestmentComponent,
    AccountStatementComponent,
    AutoFocusDirective,
    SiteLayoutComponent,
    SortDirective,
    AppLayoutComponent,
    SafeHtmlPipe,
    ViewUpdatesComponent,
    ViewDocumentComponent,
    SendEmailComponent,
    SettingsComponent,
    ManageEmailComponent,
    EditProfileComponent,
    ViewUserDetailsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
   // NgMultiSelectDropDownModule,
    SwiperModule,
    CKEditorModule,
    NgOtpInputModule,
    NgxDocViewerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAjeJEPREBQFvAIqDSZliF0WjQrCld-Mh0"
    }),
    PdfViewerModule,
    NgChartsModule.forRoot({
      defaults: {},
      plugins: [Annotation]
    }),
    EmailEditorModule,
    HighchartsChartModule
  ],

  providers: [DatePipe, EmailEditorComponent,{provide:OWL_DATE_TIME_LOCALE,useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
