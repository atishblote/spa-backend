import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../shared/global.service';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-listing',
  standalone: true,
  imports: [RouterLink , DatePipe , NgClass , FormsModule],
  templateUrl: './all-listing.component.html',
  styleUrl: './all-listing.component.css'
})
export class AllListingComponent implements OnInit {
  token:any
  email:any
  isLoaded:boolean = false
  items: any[] = [];
  isCheckboxCheck: boolean = false; // Used to toggle the delete button
  areaSelectedValues: number[] = [];
  selectedItems: any[] = []; // Store selected items
  allList:any
  delId:any | undefined
  productCount:number = 0
  page: number = 1; // Current page for pagination
  pageSize: number = 4; // Number of items per page
  toatalPage:number = 0
  entryofItems:number = 0
  constructor(private global:GlobalService, private toster:ToastrService){
  }
  ngOnInit(): void {
    initFlowbite()
    // initFlowbite()
    this.token = this.global.getUserData().token
    this.email = this.global.getUserData().email
    this.getList("all-listings", this.email, this.token, this.page, this.pageSize)
  }
  getList(type: string, email: string, token: string, page: number, pageSize: number): void{
    this.global.getWithToken(`${type}?filters[users_permissions_user][email][$eq]=${email}&populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,token).subscribe({
      next:(res:any)=>{
        console.log(res)
        this.allList = res.data.map((item: any) => ({ ...item, selected: false })); // Initialize with selected: false
        this.productCount = this.allList.length
        this.productCount = res.meta.pagination.total;
        this.toatalPage = res.meta.pagination.pageCount;
        console.log(this.productCount)
        this.isLoaded = true
      },
      error: (err:any)=>{
        console.log("Bad request")
        this.isLoaded = false
      }
    })
  }


  // Function to handle checkbox changes
  onCheckboxChange(event: any, id: any, type: string): void {
    // console.log(id)
    this.delId = id
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
    
    console.log(this.areaSelectedValues)
    
    if(this.areaSelectedValues.length > 0){
        this.isCheckboxCheck = true

      }else{
        this.isCheckboxCheck = false

      }
    
  }

  deleteSelectedItems(): any {
    // const areas = this.areaSelectedValues.map(id => ({ "id":id }));

    this.global.deleteWithToken(this.delId,"all-listings",this.token).subscribe({
      next: (res:any)=>{
        console.log(res)
        this.getList("all-listings", this.email, this.token, this.page, this.pageSize);
        this.toster.success("Entry Deleted" , "DELETE")
        this.isCheckboxCheck = false
      },
      error:(err:any)=>{
        this.getList("all-listings", this.email, this.token, this.page, this.pageSize);
        console.log(err)
        this.toster.success(err.error.message , "ERROR")

      }
    })
  }


  changePage(newPage: number) {
    this.isLoaded = false
    this.page = newPage;
    this.getList("all-listings", this.email, this.token, this.page, this.pageSize);
    
  }

  goToPreviousPage() {
    if (this.page > 1) {
      this.changePage(this.page - 1);
    }
  }

  goToNextPage() {
    if (this.page < Math.ceil(this.productCount / this.pageSize)) {
      this.changePage(this.page + 1);
    }
  }

 

}
