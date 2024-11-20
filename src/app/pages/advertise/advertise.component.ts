import { Component } from '@angular/core';
import { GlobalService } from '../../shared/global.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-advertise',
  standalone: true,
  imports: [DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './advertise.component.html',
  styleUrl: './advertise.component.css'
})
export class AdvertiseComponent {
  token:any
  email:any
  changePfrom:any
  storeUserData:any
  allproducts:any
  uId:any
  formCreate:any
  constructor(private global:GlobalService, private fb: FormBuilder, private toster: ToastrService){}

  ngOnInit(): void {
    initFlowbite()
    this.token = this.global.getUserData().token
    this.email = this.global.getUserData().email
    this.uId = this.global.getUserData().id
    
    this.getData(this.token,this.email)

    this.formCreate = this.fb.group({
      title: ['', Validators.required],
      all_listings: ['', Validators.required],
      users_permissions_user: ['', [Validators.required]]
    
    });

    this.global.getWithToken(`all-listings?filters[users_permissions_user][email][$eq]=${this.email}`,this.token).subscribe({
      next:(res:any)=>{
        console.log(res)
        this.allproducts = res.data
      },
      error: (err:any)=>{
        console.log("Bad request")
      }
    })

  }

  getData(token:string,email:string){
    this.global.getWithToken(`marketings?filters[users_permissions_user][email][$eq]=${email}&populate[0]=all_listings.feature`,token).subscribe({
      next:(res:any)=>{
        this.storeUserData = res.data
        console.log(this.storeUserData)
       
        // this.router.navigate(['login'])
      },
      error: (err:any)=>{
        console.log
      }
    })
  }


  onSubmit(data:any){
    
    if(!this.formCreate.invalid){
      console.log(data)
      const Fdata={
        "data":{
        "title":data.title,
        "all_listings" : {"id":data.all_listings},
        "users_permissions_user":{"id":data.users_permissions_user}
    }}
      this.global.postWithToken(Fdata , "marketings", this.token).subscribe({
        next: (res: any) => {
          this.toster.success('Added new advertisement', 'Success');
          this.getData(this.token,this.email)

          // console.log(res)
          this.formCreate.reset();
        },
        error: (err: any) => {
          this.toster.error(err.error.error.message, 'Error');
        },
      })
    }
  }
}
