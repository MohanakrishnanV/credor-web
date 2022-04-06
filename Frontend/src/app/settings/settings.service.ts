import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  APIURL = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  UpdateAdminAccount(data: any) {
    return this.http.put(this.APIURL + '/Settings/updateadminaccount', data, { responseType: 'json' });
  }

  GetAdminUser(RoleId: any) {
    return this.http.get(this.APIURL + '/Settings/getbyroleId/' + RoleId, { responseType: 'json' });
  }

  CreateAdminUser(data: any): Observable<any> {
    return this.http.post(this.APIURL + '/Settings/saveadminuser', data, { responseType: 'json' });
  }

  UpdateAdminUser(data: any) {
    return this.http.put(this.APIURL + '/Settings/updateadminuser', data, { responseType: 'json' });
  }

  DeleteAdminUser(data: any) {
    return this.http.put(this.APIURL + '/Settings/deleteadminuser', data, { responseType: 'json' });
  }

  AdminUserAccountStatus(data: any) {
    return this.http.put(this.APIURL + '/Settings/adminuseraccountstatus', data, { responseType: 'json' });
  }

  GetRoleFeatureMapping(roleId: any) {
    return this.http.get(this.APIURL + '/Settings/getrolefeaturemapping/' + roleId, { responseType: 'json' });
  }

  GetUserFeatureMapping(UserId: any) {
    return this.http.get(this.APIURL + '/Settings/getuserfeaturemapping/' + UserId, { responseType: 'json' });
  }

  UpdateOwnerAccount(data : any){
    return this.http.put(this.APIURL + '/Settings/updateowneraccount',data,{responseType : 'json'});
  }

  GetEmailTemplate(){
    return this.http.get(this.APIURL + '/Settings/getemailtemplate',{responseType : 'json'});
  }

  UpdateEmailTemplate(data : any){
    return this.http.put(this.APIURL + '/Settings/updateemailtemplate',data,{responseType : 'json'});
  }

  UpdateEmailTemplateStatus(data : any){
    return this.http.put(this.APIURL + '/Settings/activeinactiveemailtemplate',data,{responseType : 'json'});
  }

  GetCredorInfo(){
    return this.http.get(this.APIURL + '/Settings/credorinfo',{responseType : 'json'});
  }

  UpdateCredorInfo(data : any){
    return this.http.put(this.APIURL + '/Settings/credorinfoupdate',data ,{responseType : 'json'});
  }
}
