import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {
  APIURL = environment.BASE_URL;
  constructor(private http : HttpClient,private route : Router) { }

  getRecipients(){
    return this.http.get(this.APIURL + '/Email/getemailrecipients' ,{responseType : 'json'});
  }

  getfromemail(){
    return this.http.get(this.APIURL + '/Email/getcredorfromemailaddresses' ,{responseType : 'json'});
  }

  getEmailType(){
    return this.http.get(this.APIURL + '/Email/getemailtypes' ,{responseType : 'json'});
  }

  getTemplates(){
    return this.http.get(this.APIURL + '/Email/getemailtemplates', {responseType : 'json'})
  }

  SendEmail(data : any){
    return this.http.post(this.APIURL + '/Email/sendmail', data,{responseType : 'json'});
  }
  
  
}
