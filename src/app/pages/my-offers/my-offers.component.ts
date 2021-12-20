import { Component, OnInit,HostListener ,ElementRef , ViewChild} from '@angular/core';
import { FormGroup, FormBuilder ,FormControl,Validators  } from '@angular/forms';
import {Router} from '@angular/router';
import { BasicService } from '../../services/basic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {UpdateMediaList} from '../../interface/offersType';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger
} from "@angular/animations";
import * as $ from 'jquery';
import { ModalService } from '../_modal/modal.service';

export interface AutoCompleteModel {
  value: any;
  display: string;
}


@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(1, [
            animate('0.1s', style({ opacity: 0  }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(1, [
            animate('0.1s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})

export class MyOffersComponent implements OnInit {
  public filterInputs: FormGroup;
  public filterInputsMobile: FormGroup;
  public offersSubscriber: Subscription;
  public cityListSubscriber: Subscription;
  public cityListData: any;
  public clientData:UpdateMediaList;
  public displayData:UpdateMediaList;
  public headerHeight;
  public displayNodata:Boolean;
  
  constructor(
    private router: Router,
    private bService: BasicService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
  ) { 
    this.filterInputs = this.formBuilder.group({

      origin: new FormControl('', Validators.compose([
      ])),
      destination: new FormControl('', Validators.compose([
      ])),

    });

    this.filterInputsMobile = this.formBuilder.group({

      origin: new FormControl('', Validators.compose([
      ])),
      destination: new FormControl('', Validators.compose([
      ])),

    });
  }

  public originCity = [];
  public destinationCity = [];

  @ViewChild('headerel')  headerelement: ElementRef;

  scrolled: boolean = false;
  scrollPx:any;
  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //     this.scrolled = window.scrollY > this.headerHeight;
  //     this.scrollPx = window.scrollY;
  //     //console.log("tst",this.scrollPx, "aa",this.scrolled);
  // }

  ngAfterViewInit() {
    this.headerHeight = this.headerelement.nativeElement.offsetHeight;
    // console.log('header : ', this.headerHeight);
  }

  ngOnInit() {
    //on page load get my offers
    

    this.getOffers();
    
    $(document).ready(function() {

        $(document).on('click keydown', '.sortFilterTagOrigin', function(evt){
          // console.log('evt', evt);
          if(evt.key == "Tab" && evt.shiftKey == false){
            evt.preventDefault();
            setTimeout(function(){$('.sortFilterDesktop__label.destinarion--label').focus()}, 200);
          }

          if(evt.key == "Tab" && evt.shiftKey == true){
            setTimeout(function(){$('.sortFilterDesktop__label.origin--label').focus()}, 200);
          }

        });

        $(document).on('click keydown', '.sortFilterTagDestination', function(evt){
          // console.log('evt', evt);
          if(evt.key == "Tab" && evt.shiftKey == false){
            console.log('evt', evt);
            evt.preventDefault();
            setTimeout(function(){$('.offerList__container').focus()}, 200);
          }

          if(evt.key == "Tab" && evt.shiftKey == true){
            setTimeout(function(){$('.sortFilterDesktop__label.destinarion--label').focus()}, 200);
          }
        });

  });
  }

  

  filterData(event,callFrom){
    this.displayData= this.clientData;
    this.displayNodata = false;
    let filterData:any;
    
    if(callFrom == 'desktop'){
      filterData = this.filterInputs;
    }
    else if(callFrom == 'mobile'){
      filterData = this.filterInputsMobile;
    }

    if(filterData.value.origin.length > 0){

      let originFilter = filterData.value.origin;
      this.displayData = this.displayData.filter((list) => { 
        for(let i=0;i<originFilter.length;i++){
          if(list.origin == originFilter[i].display){
            return list;
          }
        }
      });
    }
    
    if(filterData.value.destination.length > 0){
      let destinationFilter = filterData.value.destination;
      this.displayData = this.displayData.filter((list) => { 
        for(let i=0;i<destinationFilter.length;i++){
          if(list.destination == destinationFilter[i].display){
            return list;
          }
        }
      });
    }
    
    if(filterData.value.origin.length == 0 && filterData.value.destination.length == 0){//no filter
      //console.log('no filter');
      this.displayData= this.clientData;
    }

    if(this.displayData.length == 0){
      this.displayNodata = true;
    }

  }

  getOffers(){
    this.cityListSubscriber = this.bService.getCityList().subscribe((res : any)=>{
      //console.log('cityList', res);
      this.cityListData = res.data;
    });

    this.offersSubscriber = this.bService.getOffers().subscribe((res : any)=>{
      //localStorage.setItem('userToken', data.token);
      
      this.clientData = res.data.map(list =>{
        return {
        departureDate:new Date(list.departureDate),
        destination:list.destination,
        offerType:list.offerType,
        origin:list.origin,
        price:list.price,
        returnDate:new Date(list.returnDate),
        seatAvailability:list.seatAvailability,
        uuid:list.uuid,
        departureDateDisplay:this.convertDate(new Date(list.departureDate)),
        returnDateDisplay:this.convertDate(new Date(list.returnDate)),
        originCity:this.cityListData.filter(obj => {return obj.cityCode == list.origin})[0].city,
        destinationCity:this.cityListData.filter(obj => {return obj.cityCode == list.destination})[0].city,
        }
      });
      this.displayData = this.clientData;
      let tempdest =res.data.map((list,index) =>{
        return {
          display:list.destination,
          value:(index+1)
        }
      });
      let temporigin =res.data.map((list,index) =>{
        return {
          display:list.origin,
          value:(index+1)
        }
      });

      //remove deuplicate vals
      this.destinationCity = tempdest.filter((elem, index, self) => self.findIndex((t) => {
        return (t.display === elem.display)}) === index);
      //remove deuplicate vals
      this.originCity = temporigin.filter((elem, index, self) => self.findIndex((t) => {
        return (t.display === elem.display)}) === index);

      console.log('originCity',this.clientData)
      
    },
    (err: HttpErrorResponse)=>{
      
      console.log(`getting data failed ${err}`)
    });
  }
  convertDate(date){
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  naviGateHome(){
    this.router.navigateByUrl('/home');
  }

  openMobFilterModal(){
    this.modalService.open('mobFilterModal');
  }

  closeMobFilterModal(){
    this.modalService.close('mobFilterModal');
  }
  
  ngDestroy() {
    this.offersSubscriber.unsubscribe();
    this.cityListSubscriber.unsubscribe();
  }  

}
