import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalService } from '../../shared/global.service';
import { initFlowbite } from 'flowbite';
import {
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { empty } from 'rxjs';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent implements OnInit {
  admi: boolean = true;
  userData: any;
  token: any;
  email: any;

  areaSelectedValues: any;
  delId: any;
  isCheckboxCheck: boolean = false;
  editService : any = undefined

  formCreate: any;
  allService: any;


    title:any = ''
    minutes:any = 0
    price:any = 0
    description:any = ''
  formTouched :boolean= false


  constructor(
    private global: GlobalService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    initFlowbite();

    this.formCreate = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      minutes: ['', [Validators.required]],
      price: ['', Validators.required],
      users_permissions_user: ['', Validators.required],
    });

    this.userData = this.global.getUserData();
    console.log(this.userData);

    this.token = this.global.getUserData().token;
    this.email = this.global.getUserData().email;
    this.getList();
  }

  getList() {
    this.global
      .getWithToken(
        `types?filters[users_permissions_user][email][$eq]=${this.email}`,
        this.token
      )
      .subscribe({
        next: (res: any) => {
          this.allService = res.data;
          console.log(this.allService);
        },
        error: (err: any) => {
          console.log(err.error);
        },
      });
  }

  // Function to handle checkbox changes
  onCheckboxChange(event: any, id: any, type: string): void {
    // console.log(id)
    this.delId = id;
    console.log(this.delId);
    this.isCheckboxCheck = true;

    const editData = this.allService.filter((ed:any)=>{
      return ed.documentId === this.delId
    })
    this.editService = editData[0]
    this.title = this.editService.title
    this.minutes = this.editService.minutes
    this.price = this.editService.price
    this.description= this.editService.description
  }

  onSubmit(data: any) {
    const body = {
      data: data,
    };
    // console.log('Form is valid:', this.loginForm.value);
    if (this.formCreate.valid) {
      this.global.postWithToken(body, 'types', this.token).subscribe({
        next: (res: any) => {
          this.toastr.success('Added new service', 'Success');
          this.getList();
          // console.log(res)
          this.formCreate.reset();
        },
        error: (err: any) => {
          this.toastr.error(err.error.error.message, 'Error');
        },
      });
    } else {
      this.formCreate.markAllAsTouched();

      this.toastr.warning('Fill all fields', 'Warning');
    }
  }

  // delete itesm
  deleteSelectedItems(): any {
    this.global.deleteWithToken(this.delId, 'types', this.token).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getList();
        this.toastr.success('Entry Deleted', 'DELETE');
        this.isCheckboxCheck = false;
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.success(err.error.message, 'ERROR');
      },
    });
  }

  // edit model
  onEditSubmit(f: NgForm){
    console.log(f.value)
    const body = {
      "data": f.value
    } 
    if(f.value.title !== ""){
      this.global.putWithToken(body,this.delId,"types",this.token).subscribe({
        next: (res: any) => {
          console.log(res);
          this.getList();
          this.toastr.success('Entry Edited', 'Updated');
          this.isCheckboxCheck = false;
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.success(err.error.message, 'ERROR');
        },
      })    
    }
  }


}
