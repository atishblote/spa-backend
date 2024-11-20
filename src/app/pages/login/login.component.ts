import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../shared/global.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule, ReactiveFormsModule , NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm : any
  isValid:boolean = true

  constructor(private global:GlobalService, private fb:FormBuilder , private toastr: ToastrService, private router:Router){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      "identifier": ["" , [Validators.required]],
      "password": ["" , [Validators.required]]
    });
  }


  onSubmit(data:any){
    // console.log('Form is valid:', this.loginForm.value);
    if (this.loginForm.valid) {
      this.isValid = false
      this.global.login(data,"auth/local").subscribe({
        next: (res:any)=>{
          const useData = {
            email:res.user.email,
            username:res.user.username,
            docid:res.user.documentId,
            id:res.user.id,
            blocked:res.user.blocked,
            token:res.jwt
          }
          // console.log(res)
          this.toastr.success(`Welcome ${res.user.username}`, 'Success');

          this.global.storeUserData(useData)
          this.router.navigate(['admin'])
          
        },
        error: (err:any)=>{
        this.toastr.error(err.error.error.message, 'Error');
        }
      })

    } else {
      this.loginForm.markAllAsTouched();
      this.isValid = false

      this.toastr.warning('Fill all fields', 'Warning');
    }
  }

  setUppercaseName(data:any){
    // console.log(data)
    this.isValid = true
  }

}
