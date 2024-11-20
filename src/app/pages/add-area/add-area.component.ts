import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../shared/global.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { createSlug } from '../../shared/slug-util';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-area',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './add-area.component.html',
  styleUrl: './add-area.component.css',
})
export class AddAreaComponent implements OnInit {
  token: any;
  userData: any;
  userId: any;
  allLocation: any;
  allArea: any;
  isLoaded: boolean = false;
  slug:any
  formCreate: any;
  constructor(
    private global: GlobalService,
    private toster: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.token = this.global.getUserData().token;
    this.userData = this.global.getUserData().email;
    this.userId = this.global.getUserData();
    this.getLocation(this.token, this.userData);

    this.formCreate = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      users_permissions_user: ['', Validators.required],
    });
  }

  getLocation(token: string, email: string) {
    // this.global.getWithToken(`areas?fields[0]=title&filters[users_permissions_users][email][$eq]=${email}`, token).subscribe({
    //   next: (res:any)=>{
    //     this.allArea = res.data
    //   }
    // })
    // Use forkJoin to combine the API calls
    forkJoin({
      locations: this.global.getWithToken(`locations?fields[0]=title`, token),
      areas: this.global.getWithToken(
        `areas?filters[users_permissions_users][email][$eq]=${email}&populate=*`,
        token
      ),
    }).subscribe({
      next: (res: any) => {
        this.allLocation = res.locations.data;
        this.allArea = res.areas.data;

        console.log(this.allLocation);
        console.log(this.allArea);
        this.isLoaded = true;
      },
      error: (err: any) => {
        console.log(err.error.error.message);
      },
    });
  }
  geneateSlug(title: any): string {
    return createSlug(title);
  }

  onSubmit(data: any) {
    const slug = this.geneateSlug(data.title);
    console.log(slug);
    if (this.formCreate.valid) {
      const body = {
        data: {
          title: data.title,
          slug: slug,
          location: [{ id: data.location }],
          users_permissions_users: { id:  data.users_permissions_user },
        },
      };

      this.global
        .postWithToken(body, 'areas', this.token)
        .subscribe({
          next: (res: any) => {
            this.toster.success("Wait Under review", 'SUCCESS');
            this.getLocation(this.token, this.userData);
            this.formCreate.reset()
          },
          error: (err: any) => {
            this.toster.error(err.error.error.message, 'ERROR');
          },
        });
    } else {
      this.formCreate.markAllAsTouched();
      this.toster.error('Fill all fields', 'EMPTY');
    }
  }
}
