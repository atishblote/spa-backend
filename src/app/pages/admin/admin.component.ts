import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { GlobalService } from '../../shared/global.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  name:any
  email:any
  userData:any
  constructor(private global: GlobalService, private router: Router){}
  ngOnInit(): void {
    initFlowbite()

    this.userData =  this.global.getUserData()
   
    // console.log(this.userData)
  }

  logoutuser(){
    this.global.logout()
    this.router.navigate(['login'])
  }
}
