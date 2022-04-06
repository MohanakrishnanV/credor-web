import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  APIURL = environment.BASE_URL;
  constructor(private http : HttpClient,private route : Router) { }

  getReportUser(Id: any){
    return this.http.get(this.APIURL + '/Reports/getusersreports' + '/' + Id ,{responseType : 'json'});
  }

  getInvestment(Id: any){
    return this.http.get(this.APIURL + '/Reports/getinvestmentsreports' + '/' + Id ,{responseType : 'json'});
  }

  getDistribution(){
    return this.http.get(this.APIURL + '/Reports/getdistributionsreports' ,{responseType : 'json'});
  }

  GetPortfolioOfferings(){
    return this.http.get(this.APIURL + '/portfolio/getportfolioofferings' ,{responseType : 'json'});
  }

  GetTax(OfferingId : any){
    return this.http.get(this.APIURL + '/Reports/gettaxreports/' + OfferingId,{responseType : 'json'});
  }

  GetFormD(offeringId : any){
    return this.http.get(this.APIURL + '/Reports/getformdreports/' + offeringId,{responseType : 'json'});
  }


}
