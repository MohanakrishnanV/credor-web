import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageEmailService {
  APIURL = environment.BASE_URL;

  constructor(private http : HttpClient,private route : Router) { }

  getEmails(){
    return this.http.get(this.APIURL + '/Email/getcredoremaildetails' ,{responseType : 'json'});
  }

  getSystemNotification(){
    return this.http.get(this.APIURL + '/Email/getsystemnotifications' ,{responseType : 'json'});
  }

  getSendEmailDetails(id:any){
    return this.http.get(this.APIURL + '/Email/getallcredoremaildetail' + '/' + id ,{responseType : 'json'});
  }

  deleteDraftEmail(value : any){
    return this.http.put(this.APIURL + '/Email/deletecredoremaildetailbyid', value, {responseType : 'json'})
  }

  resentDraftEmail(Id : any, UserId : any){
    return this.http.post(this.APIURL + '/Email/resendmail/' + Id + '/' + UserId, {responseType : 'json'})
  }

  archivesentEmail(value : any){
    return this.http.put(this.APIURL + '/Email/archivecredoremaildetailbyid', value, {responseType : 'json'})
  }
}
