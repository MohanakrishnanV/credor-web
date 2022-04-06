import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  APIURL = environment.BASE_URL;
  constructor(private http : HttpClient) { }

  saveDomain(data : any){
    return this.http.post(this.APIURL + '/Email/addcredordomain', data,{responseType : 'json'});
  }

  getDomain(){
    return this.http.get(this.APIURL + '/Email/getcredordomains' , {responseType : 'json'})
  }

  deleteDomain(Id : any, UserId : any){
    return this.http.delete(this.APIURL + '/Email/deletecredordomain/' + Id + '/' + UserId, {responseType : 'json'})
  }

  saveEmail(data : any){
    return this.http.post(this.APIURL + '/Email/addcredorfromemailaddress', data,{responseType : 'json'});
  }
  
  getEmail(){
    return this.http.get(this.APIURL + '/Email/getcredorfromemailaddresses' , {responseType : 'json'})
  }
  
  deleteEmail(Id : any, UserId : any){
    return this.http.delete(this.APIURL + '/Email/deletecredorfromemailaddress/' + Id + '/' + UserId, {responseType : 'json'})
  }

  editEmail(data : any){
    return this.http.put(this.APIURL + '/Email/updatecredorfromemailaddress', data,{responseType : 'json'});
  }

  saveTemplate(data : any){
    return this.http.post(this.APIURL + '/Email/addemailtemplate', data,{responseType : 'json'});
  }
  
  getTemplates(){
    return this.http.get(this.APIURL + '/Email/getemailtemplates', {responseType : 'json'})
  }
  
  deleteTemplate(Id : any, UserId : any){
    return this.http.delete(this.APIURL + '/Email/deleteemailtemplate/' + Id + '/' + UserId, {responseType : 'json'})
  }
  
  updateTemplate(data : any){
    return this.http.put(this.APIURL + '/Email/updateemailtemplate', data,{responseType : 'json'});
  }
  
}
