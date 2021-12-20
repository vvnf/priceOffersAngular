import { Injectable, Type } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BasicService {
  readonly rooturl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  userAuthen(userName, role){
    let data = `userName=${userName}&role=${role}`;
    //let data = {userName:userName,role:role};
    let reqHeader=new HttpHeaders({'Content-Type':'application/x-www-urlencoded'});
    //return this.http.post(`${this.rooturl}/price_offer/getToken`,data,{headers: reqHeader});
    return this.http.post('/getToken',data,{headers: reqHeader});
    //return this.http.post('/getToken',data);
  }

  getOffers(){
    return this.http.get('/offers');
   }

  getCityList(){
    return this.http.get('/cityList');
  } 

   callRefreshToken(tokenPayload){
    return this.http.post('/refresh',tokenPayload);
   }
}
