import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // baseUrl:string= 'https://spa-strapi-1.onrender.com/api'
  baseUrl:string= 'https://inspired-positivity-3f2cb0cfbd.strapiapp.com/api'

  //globalToken:string = "70af910f02a243aaf6ce4497162d998c0fdb404e6b54e245e5b01698e19caab33490c8cff0c8b2b73f53971defc84ceca7f75d08d1e3bdbe8f6203f8d50bbaaaeab1934cd37a1851bf8600c4d9a8f9c7b51428bc0cd9f47044a275070c579e61dae31d3f7727e950f7156542b4fdd1dd63ff8a2a9b7e63fa41497ac98c07aa82"
  globalToken:string = "d500b0100bead4260f3692f9f04f7789a4c30f3ae0132366c72559c9d81f835a2f764a03b71a8d3528230ebee7ad5c85632e7e69c7ee43ad9ae25acc2521c8151847dc1b209204069c618a5652eaceb25e55fe49a8166f30161414695de045ff07c541ae1e19767b7f05d01450525d19ee929a58a51c921e3a758d509eafc623";
  apiKey:any

  constructor(private http: HttpClient) { }

  private globalHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization' : `Bearer ${this.globalToken}`
    });
  }

  // private getSiteHeaders(): HttpHeaders {
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //     'Authorization' : `Bearer`
  //   });
  // }

  private siteHeadersToken(token:string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization' : `Bearer ${token}`
    });
  }

  logout(): void{
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    sessionStorage.clear()
    
  }

  storeUserData(userData: any): void {
    sessionStorage.setItem('userData', JSON.stringify(userData));
    sessionStorage.setItem('authToken', userData.token);
  }
  getUserData() {
    const data = sessionStorage.getItem('userData');
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }


  login(body:any,endpoint:string){
    const url = `${this.baseUrl}/${endpoint}`
    const headers = this.globalHeader()
    return this.http.post(url, body, { headers })
  }

  getUserSingle(endpoint:string){
    const url = `${this.baseUrl}/${endpoint}`
    const headers = this.globalHeader()
    return this.http.get(url, { headers })
  }

  postWithToken(body:any,endpoint:string, token:any){
    const url = `${this.baseUrl}/${endpoint}`
    const headers = this.siteHeadersToken(token)
    return this.http.post(url, body, { headers })
  }

  getWithToken(endpoint:string, token:string){
    const url = `${this.baseUrl}/${endpoint}`
    const headers = this.siteHeadersToken(token)
    return this.http.get(url, { headers })
  }
  deleteWithToken(id:any,endpoint:string, token:any){
    const url = `${this.baseUrl}/${endpoint}/${id}`
    const headers = this.siteHeadersToken(token)
    return this.http.delete(url, { headers })
  }

  putWithToken(body:any,id:any,endpoint:string, token:any){
    const url = `${this.baseUrl}/${endpoint}/${id}`
    const headers = this.siteHeadersToken(token)
    return this.http.put(url, body, { headers })
  }

  uploadFile(endpoint:string,file: File, token:string) {
   const url = `${this.baseUrl}/${endpoint}`
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(url, formData, { headers });
  }
  // postWithoutToken(body:any,endpoint:string){
  //   const url = `${this.baseUrl}/${endpoint}`
  //   const headers = this.getSiteHeaders()
  //   return this.http.post(url, body, { headers })
  // }

  // getWithoutToken(endpoint:string){
  //   const url = `${this.baseUrl}/${endpoint}`
  //   const headers = this.getSiteHeaders()
  //   return this.http.get(url, { headers })
  // }


  // updateWithToken(body:any,endpoint:string, token:any){
  //   const url = `${this.baseUrl}/${endpoint}`
  //   const headers = this.getSiteHeaders()
  //   return this.http.put(url, body, { headers })
  // }
  // getWithToken(endpoint:string){
  //   const url = `${this.baseUrl}/${endpoint}`
  //   const headers = this.getSiteHeaders()
  //   return this.http.get(url, { headers })
  // }

  // deleteWithToken(endpoint:string){
  //   const url = `${this.baseUrl}/${endpoint}`
  //   const headers = this.getSiteHeaders()
  //   return this.http.delete(url, { headers })
  // }
}
