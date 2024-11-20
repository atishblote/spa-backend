import { Component, OnInit } from '@angular/core';
import { createSlug } from '../../shared/slug-util';
import { GlobalService } from '../../shared/global.service';
import { forkJoin } from 'rxjs';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.css',
})
export class CreateListingComponent implements OnInit {
  isGalleryUpload: boolean = true;
  isGalleryUpload2: boolean = true;
  isGalleryUpload3: boolean = true;

  gallery: any[] = [];

  AllselectedFile: any;
  img1: any;
  img2: any;
  img3: any;

  formCreate: any;
  resData: any;
  userData: any;
  locationsData: any;
  areasData: any;
  categoryData: any;
  typesData: any;
  token: any;
  selectedFile: any;
  fileurl: any;
  isImgUpload: boolean = false;

  areaSelectedValues: number[] = [];
  categorySelectedValues: number[] = [];
  servicesSelectedValues: number[] = [];

  isLoaded: boolean = false;
  constructor(
    private global: GlobalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.formCreate = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      offers: [false],
      description: ['', Validators.required],
      location: ['', Validators.required],
      services: ['', Validators.required],
      areas: ['', Validators.required],
      users_permissions_user: ['', Validators.required],
      service_categories: ['', Validators.required],
      feature: ['', Validators.required],
    });

    // Generate the slug dynamically based on the title
    this.userData = this.global.getUserData();
    console.log(this.userData.email);
    const email = this.global.getUserData().email;
    const token = this.global.getUserData().token;
    this.token = token;
    this.fetchAllData(email, token);
  }

  // call api
  fetchAllData(email: any, token: any) {
    // Use forkJoin to combine the API calls
    forkJoin({
      locations: this.global.getWithToken(`locations`, token),
      areas: this.global.getWithToken(
        `areas?filters[users_permissions_users][email][$eq]=${email}`,
        token
      ),
      category: this.global.getWithToken(
        `service-categories?fields=title`,
        token
      ),
      types: this.global.getWithToken(`types`, token),
    }).subscribe({
      next: (res: any) => {
        this.locationsData = res.locations.data;
        this.areasData = res.areas.data;
        this.categoryData = res.category.data;
        this.typesData = res.types.data;
        console.log(this.locationsData);
        console.log(this.areasData);
        console.log(this.typesData);
        console.log(this.categoryData);
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

  // Function to handle checkbox changes
  onCheckboxChange(event: any, id: number, type: string): void {
    if (type == 'areas') {
      if (event.target.checked) {
        // Add the selected value to the array
        this.areaSelectedValues.push(id);
      } else {
        // Remove the unselected value from the array
        const index = this.areaSelectedValues.indexOf(id);
        if (index !== -1) {
          this.areaSelectedValues.splice(index, 1);
        }
      }
    }

    // services
    else if (type == 'services') {
      if (event.target.checked) {
        // Add the selected value to the array
        this.servicesSelectedValues.push(id);
      } else {
        // Remove the unselected value from the array
        const index = this.servicesSelectedValues.indexOf(id);
        if (index !== -1) {
          this.servicesSelectedValues.splice(index, 1);
        }
      }
    }

    // category
    else if (type == 'category') {
      if (event.target.checked) {
        // Add the selected value to the array
        this.categorySelectedValues.push(id);
      } else {
        // Remove the unselected value from the array
        const index = this.categorySelectedValues.indexOf(id);
        if (index !== -1) {
          this.categorySelectedValues.splice(index, 1);
        }
      }
    }
  }

  // Function to create the object with only id for areas, services, and categories
  createSelectedObject(): any {
    const areas = this.areaSelectedValues.map((id) => ({ id: id }));
    const services = this.servicesSelectedValues.map((id) => ({ id: id }));
    const serviceCategories = this.categorySelectedValues.map((id) => ({
      id: id,
    }));

    console.log(areas);
    const selectedObject = {
      areas: areas,
      services: services,
      service_categories: serviceCategories,
    };

    // console.log(selectedObject); // Output the final object
    return selectedObject;
  }

  // file upload
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
    this.isImgUpload = false;
    console.log(this.selectedFile);
  }
  // Called whenever a file is selected
  onFileSelectedAll(event: any, count: any): void {
    if (event.target.files.length > 0) {
      this.AllselectedFile = event.target.files[0];
    }
    console.log(this.AllselectedFile);
    this.allonUpload(this.AllselectedFile, count);
  }

  // // Recursive function to upload files one by one
  // uploadNextFile(index: number): void {
  //   if (index < this.selectedFiles.length) {
  //     const formData = new FormData();
  //     formData.append('file', this.selectedFiles[index]);

  //     // this.http.post<{ id: number, url: string }>('/upload-endpoint', formData, {
  //     //   headers: { Authorization: `Bearer ${this.token}` }
  //     // }).subscribe({
  //     //   next: (res) => {
  //     //     this.gallery.push({ id: res.id, url: res.url });
  //     //     this.toastr.success(`Image ${index + 1} uploaded successfully`, 'IMAGE');
  //     //     this.uploadNextFile(index + 1); // Upload the next file
  //     //   },
  //     //   error: (err) => {
  //     //     console.error(err);
  //     //     this.toastr.error(`Failed to upload image ${index + 1}`, 'IMAGE');
  //     //     this.uploadNextFile(index + 1); // Continue with the next file, even if this one fails
  //     //   }
  //     // });
  //     console.log(formData)
  //   } else {
  //     this.isImgUpload = false; // Reset flag when all files are uploaded
  //     console.log("All files uploaded:", this.gallery);
  //   }
  // }

  allonUpload(fileData: any, count: any): void {
    if (fileData) {
      // this.isImgUpload = true
      this.global.uploadFile('upload', fileData, this.token).subscribe({
        next: (res: any) => {
          console.log(res[0]);
          // this.fileurl = res[0];
          this.toastr.success('Image Added', 'IMAGE');
          if (count == 1) {
            this.isGalleryUpload = false;
            this.img1 = res[0];
          }
          if (count == 2) {
            this.isGalleryUpload2 = false;
            this.img2 = res[0];
          }
          if (count == 3) {
            this.isGalleryUpload3 = false;
            this.img3 = res[0];
          }
          this.gallery = [
            { id: this.img1?.id },
            { id: this.img2?.id },
            { id: this.img3?.id },
          ];

          console.log(this.gallery);
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.warning('Image not Uploaded', 'IMAGE');
          // this.isImgUpload = false
        },
      });
    } else {
      this.toastr.error('No file selected', 'IMAGE');
      // this.isImgUpload = false
    }
  }

  // Method to upload the file
  onUpload(): void {
    if (this.selectedFile) {
      this.isImgUpload = true;
      this.global
        .uploadFile('upload', this.selectedFile, this.token)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.fileurl = res[0];
            this.toastr.success('Image Added', 'IMAGE');
          },
          error: (err: any) => {
            console.log(err);
            this.toastr.warning('Image not Uploaded', 'IMAGE');
            this.isImgUpload = false;
          },
        });
    } else {
      this.toastr.error('No file selected', 'IMAGE');
      this.isImgUpload = false;
    }
  }

  // onsubmit
  onSubmit(data: any) {
    const d = this.createSelectedObject();
    // console.log(d.areas.length > 0);

    
    
    if(d.areas.length > 0 && d.service_categories.length > 0 && d.services.length > 0 && this.fileurl?.id != undefined &&  this.gallery[0].id != undefined && data.title != "" && data.description != "" && data.location != "" && this.userData.id != undefined){
      const slug = this.geneateSlug(data.title);
      const body = {
        data: {
          title: data.title,
          slug: slug,
          offers: data.offers,
          description: data.description,
          locations: [
            {
              id: parseInt(data.location, 10),
            },
          ],
          areas: d.areas,
          feature: {
            id: this.fileurl.id,
          },
          users_permissions_user: {
            id: this.userData.id,
          },
          gallery: this.gallery,
          services: d.services,
          service_category: d.service_categories,
        },
      };
  
      console.log(body);
  
      this.global.postWithToken(body, 'all-listings', this.token).subscribe({
        next: (res: any) => {
          // console.log(res)
          this.toastr.success('Listing is created', 'Success');
          this.router.navigate(['admin/all-listing'])

        },
        error: (err: any) => {
          this.toastr.error('Unauthorized', 'Error');
        },
      });
    }else{
      this.toastr.warning("Fill the data", "EMPTY")
    }

  }
}
