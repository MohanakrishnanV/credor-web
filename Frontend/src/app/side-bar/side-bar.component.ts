import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  RoleId: any;
  RoleMapping: any = [];
  UserId: any;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    if (window.name === 'Remote') {
      this.RoleId = 1;
    } else {
      this.RoleId = Number(localStorage.getItem("RoleId"))
    }
    this.UserId = Number(localStorage.getItem("UserId"))
    this.loginService.GetRoleMapping(this.UserId,this.RoleId).subscribe(data => {
      this.RoleMapping = data;
    })
  }


}
