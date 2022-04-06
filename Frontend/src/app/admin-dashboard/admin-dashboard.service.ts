import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  APIURL = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  GetLeads() {
    return this.http.get(this.APIURL + '/AdminDashboard/getleads', { responseType: 'json' });
  }

  GetOffering() {
    return this.http.get(this.APIURL + '/AdminDashboard/getadminoffering', { responseType: 'json' });
  }

  GetUserInvestorDetails() {
    return this.http.get(this.APIURL + '/AdminDashboard/getuserinvestordetails', { responseType: 'json' });
  }

  GetAdminHeaderSummary() {
    return this.http.get(this.APIURL + '/AdminDashboard/getadminheadersummary', { responseType: 'json' });
  }
}
