import { Component, OnInit } from '@angular/core';
import { createSlug } from '../../shared/slug-util';
import { GlobalService } from '../../shared/global.service';
import { forkJoin } from 'rxjs';
import {
  FormsModule,
  NgForm,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-listing',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './edit-listing.component.html',
  styleUrl: './edit-listing.component.css'
})
export class EditListingComponent implements OnInit{
  
  // formCreate: any;
  resData: any;
  userData: any;
  locationsData: any;
  editListData:any
  areasData: any;
  categoryData: any;
  typesData: any;
  token: any;
  selectedFile: any;
  fileurl: any;
  isImgUpload:boolean = false
  listId:any
  sending:boolean = true

  selectedArea: number | null = null;


  areaSelectedValues: number[] = [];
  categorySelectedValues: number[] = [];
  servicesSelectedValues: number[] = [];
  locationSelectedValues: number[] = [];

  isLoaded: boolean = false;
  constructor(private global: GlobalService, private toastr: ToastrService, private actRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.actRouter.paramMap.subscribe((id)=>{
      this.listId = id.get('id')
      console.log(this.listId)
    })
 

    initFlowbite()
    // this.formCreate = this.fb.group({
    //   title: ['', Validators.required],
    //   slug: ["", Validators.required],
    //   offers: [false],
    //   description: ['', Validators.required],
    //   location: ['', Validators.required],
    //   services: ['', Validators.required],
    //   areas: ['', Validators.required],
    //   users_permissions_user: ['', Validators.required],
    //   service_categories: ['', Validators.required],
    //   feature: ['', Validators.required],
    // });

    // Generate the slug dynamically based on the title
    this.userData = this.global.getUserData();
    console.log(this.userData.email);
    const email = this.global.getUserData().email;
    const token = this.global.getUserData().token;
    this.token = token;
    this.getLocation(this.listId , token , email)
    this.fetchAllData(email, token);
  }

  // call api
  fetchAllData(email: any, token: any) {
    // Use forkJoin to combine the API calls
    forkJoin({
      locations: this.global.getWithToken(`locations`, token),
      areas: this.global.getWithToken(`areas`, token),
      category: this.global.getWithToken(
        `service-categories?fields=title`,
        token
      ),
      types: this.global.getWithToken(
        `types`,
        token
      ),
    }).subscribe({
      next: (res: any) => {
        this.locationsData = res.locations.data;
        this.areasData = res.areas.data;
        this.categoryData = res.category.data;
        this.typesData = res.types.data;
       
        this.isLoaded = true;
      },
      error: (err: any) => {
        console.log(err.error.error.message);
      },
    });
  }

  getLocation(id:any,token: string, email: string) {
    // console.log(token)
    this.global.getWithToken(`all-listings/${id}?filters[users_permissions_user][email][$eq]=${email}&populate=*`, token).subscribe({
      next: (res:any)=>{
        console.log(res)
        this.editListData = res.data

        this.areaSelectedValues = this.editListData.areas.map((m:any)=>{
          return m.id
        })
        this.servicesSelectedValues = this.editListData.services.map((m:any)=>{
          return m.id
        })
        this.locationSelectedValues = this.editListData.locations.map((m:any)=>{
          return m.id
        })
        this.categorySelectedValues = this.editListData.service_category.id
          
        console.log(this.areaSelectedValues)
        console.log(this.categorySelectedValues)
        console.log(this.servicesSelectedValues)


        this.fileurl = this.editListData?.feature
        console.log(this.fileurl)
      }
    })
    // Use forkJoin to combine the API calls

  }

   geneateSlug(title:any): string {
    return createSlug(title);
  }


  onCheckboxChangeEdit( id: number, type: string) {
    // Add your logic to handle area change here
    // console.log(this.categorySelectedValues)
    if (type == 'areas') {
      return this.areaSelectedValues.includes(id)
    }
    if (type == 'services') {
      return this.servicesSelectedValues.includes(id)
    }
    if (type == 'category') {
      //  console.log(`Selected Area ID: ${id}`);
      return this.categorySelectedValues.includes(id)
    }
    if (type == 'locations') {
      //  console.log(`Selected Area ID: ${id}`);
      return this.locationSelectedValues.includes(id)
    }
    else{
      return false
    }
    
  }

  // onCheckboxChangeClick( id: number, type: string) {
  //   this.selectedArea = id;
  //   // Add your logic to handle area change here
  //   console.log(`Selected Area ID: ${id}`);
  //   return false
  // }


// Function to handle checkbox changes
  onCheckboxChange(event: any, id: number, type: string): void {
    console.log(`${id} : ${type}`)
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
    // else if (type == 'category') {
    //   if (event.target.checked) {
    //     // Add the selected value to the array
    //     this.categorySelectedValues.push(id);
    //   } else {
    //     // Remove the unselected value from the array
    //     const index = this.categorySelectedValues.indexOf(id);
    //     if (index !== -1) {
    //       this.categorySelectedValues.splice(index, 1);
    //     }
    //   }
    // }
    // console.log(this.areaSelectedValues)
  }

  // Function to create the object with only id for areas, services, and categories
  createSelectedObject(): any {
    const areas = this.areaSelectedValues.map(id => ({ "id":id }));
    const services = this.servicesSelectedValues.map(id => ({ "id":id }));
    const locations = this.locationSelectedValues.map(id => ({ "id":id }));

    console.log(areas)
    const selectedObject = {
      areas: areas,
      services: services,
      locations: locations,
      service_categories: {"id":this.categorySelectedValues}
    };

    console.log(selectedObject); // Output the final object
    return selectedObject;
  }



  // file upload
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
    this.isImgUpload = false
  }

  // Method to upload the file
  onUpload(): void {
    if (this.selectedFile) {
      this.isImgUpload = true
      this.global
        .uploadFile('upload', this.selectedFile, this.token)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.fileurl = res[0];
            this.toastr.success("Image Added","IMAGE")

          },
          error: (err: any) => {
            console.log(err);
            this.toastr.warning("Image not Uploaded","IMAGE")
            this.isImgUpload = false
            
          },
        });
    } else {
      this.toastr.error('No file selected',"IMAGE")
      this.isImgUpload = false

    }
  }

  // onsubmit
  onEditSubmit(f: NgForm) {
    // console.log(f.value);
    this.sending = false


    const d = this.createSelectedObject()
   const slug =  this.geneateSlug(f.value.title)
    const body = {
      data: {
        title: f.value.title,
        slug: slug,
        offers: false,
        description: f.value.description,
        locations: d.locations,
        areas: d.areas,
        feature: {
          "id": this.fileurl.id,
        },
        users_permissions_user: {
          "id": this.userData.id,
        },
        services: d.services,
        service_category: d.service_categories,
      },
    };


    console.log(body)


    this.global.putWithToken(body, this.listId,"all-listings",this.token).subscribe({
      next: (res:any)=>{
        // console.log(res)
        this.toastr.success("Listing is Updated", 'Success');
        this.sending = true
      },
      error: (err:any)=>{
      this.toastr.error("Unauthorized", 'Error');
      this.sending = true
      }
    })
  }
}
