import { Component, OnInit,HostListener ,ElementRef , ViewChild} from '@angular/core';
import { BasicService } from '../../services/basic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Subscription } from 'rxjs';
import {Router} from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public authTokenSubscriber: Subscription;
  authTokenGenErr : boolean = false;
  jwtHelper = new JwtHelperService();
  public innerWidth: any;
  public headerHeight;
  constructor(
    private bService: BasicService,
    private router: Router,
    ) { }

  @ViewChild('headerel')  headerelement: ElementRef;


  scrolled: boolean = false;
  scrollPx:any;
  @HostListener("window:scroll", [])
  onWindowScroll() {
      this.scrolled = window.scrollY > this.headerHeight;
      this.scrollPx = window.scrollY;
      //console.log("tst",this.scrollPx, "aa",this.scrolled);
  }

  ngAfterViewInit() {
    this.headerHeight = this.headerelement.nativeElement.offsetHeight;
    console.log('header : ', this.headerHeight);
  }

  ngOnInit() {
    //on init authentication of user
    

  }
  genAuthtoken(){
    //currently hard coded for simplicity
    let userName = 'vivian';
    let role = 'basic';
    this.getUsrData(userName,role)
  }


  getUsrData(userName, role){
    //console.log(this.bService);
    this.authTokenSubscriber = this.bService.userAuthen(userName, role).subscribe((data : any)=>{
      const decryptUserData = this.jwtHelper.decodeToken(data.token);
      
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userTokenExp', decryptUserData.exp);
      console.log('Succes Auth Token',data);
      this.router.navigateByUrl('/my-offers');
    },
    (err: HttpErrorResponse)=>{
      this.authTokenGenErr = true;
      console.log(`Auth Token Generation failed ${err}`)
    });
  }




  naviGateHome(){
    this.router.navigateByUrl('/home');
  }

  ngDestroy() {
    this.authTokenSubscriber.unsubscribe();
  }  

}
