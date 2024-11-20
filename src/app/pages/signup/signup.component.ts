import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../shared/global.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{

  signUpForm:any
  isValid:boolean =  true
  constructor(private global:GlobalService, private fb: FormBuilder, private toastr:ToastrService, private router: Router){}
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
        "username": ["", Validators.required],
        "email": ["", Validators.required],
        "mobile": ["", Validators.required],
        "password": ["" , Validators.required],
        "role": 1
    })
  }


  onSubmit(data:any){
    // console.log('Form is valid:', this.loginForm.value);
    if (this.signUpForm.valid) {
      this.isValid = false
      this.global.login(data,"users").subscribe({
        next: (res:any)=>{
          console.log(res)
          this.toastr.success(`Enter OTP`, 'Success');
          this.router.navigate([`email-varify/${res.email}`])
          
        },
        error: (err:any)=>{
        this.toastr.error(err.error.error.message, 'Error');
        }
      })

    } else {
      this.signUpForm.markAllAsTouched();
      this.isValid = false

      this.toastr.warning('Fill all fields', 'Warning');
    }
  }


  setUppercaseName(data:any){
    // console.log(data)
    this.isValid = true
  }


}
