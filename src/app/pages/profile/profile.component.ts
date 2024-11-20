import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../shared/global.service';
import { initFlowbite } from 'flowbite';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit{
  storeUserData:any
  token:any
  changePfrom:any
  userData:any

  username:string | undefined
  mobile:string | undefined
  isConfirm:string | undefined
  isBlock:boolean = false

  constructor(private global:GlobalService, private fb: FormBuilder, private toster: ToastrService, private router: Router){}

  ngOnInit(): void {
    initFlowbite()
    this.token = this.global.getUserData().token
    this.userData = this.global.getUserData().id

    this.getData(this.token,this.userData)

    this.changePfrom = this.fb.group({
      "password": ["" , Validators.required],
      "currentPassword":["", Validators.required],
      "passwordConfirmation":["", Validators.required]
    })


  }

  getData(token:string,id:number){
    this.global.getWithToken(`users/${id}`,token).subscribe({
      next:(res:any)=>{
        this.storeUserData = res
        console.log(res)
        this.username = this.storeUserData.username
        this.mobile = this.storeUserData.mobile
        this.isConfirm = this.storeUserData.confirmed
        // this.router.navigate(['login'])
      },
      error: (err:any)=>{
        console.log
      }
    })
  }


  passwordChangeSubmit(data:any){
    console.log(data);
    if (this.changePfrom.valid) {
      const body = {
        "password": data.password,
        "currentPassword":data.currentPassword,
        "passwordConfirmation":data.passwordConfirmation
      };

      this.global
        .postWithToken(body, 'auth/change-password', this.token)
        .subscribe({
          next: (res: any) => {
            this.toster.success("Wait Under review", 'SUCCESS');
            this.getData(this.token, this.userData);
            this.changePfrom.reset()
          },
          error: (err: any) => {
            this.toster.error(err.error.error.message, 'ERROR');
          },
        });
    } else {
      this.changePfrom.markAllAsTouched();
      this.toster.error('Fill all fields', 'EMPTY');
    }
  }


    // edit model
    onEditSubmit(f: NgForm){
      console.log(f.value)
      
      if(f.value.mobile !== "" && f.value.username !== ""){
        this.global.putWithToken(f.value,this.userData,"users",this.token).subscribe({
          next: (res: any) => {
            console.log(res);
            this.getData(this.token,this.userData);
            this.toster.success('Updated Successfuly', 'Updated');
          },
          error: (err: any) => {
            console.log(err);
            this.toster.success(err.error.message, 'ERROR');
          },
        })    
      }
    }

    blockAccount(){
      const data = {
        "blocked":this.isBlock = true
      }
      this.global.putWithToken(data, this.userData, "users",this.token).subscribe({
        next: (res: any) => {
          console.log(res);
          this.getData(this.token,this.userData);
          this.toster.success('Account Block', 'Updated');
          this.global.logout()
          this.router.navigate(['login'])

        },
        error: (err: any) => {
          console.log(err);
          this.toster.success(err.error.message, 'ERROR');
        },
      }) 
    }
}
