import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {

  SendMessage: BehaviorSubject<any> = new BehaviorSubject({});
  SendFile : BehaviorSubject<any> = new BehaviorSubject({});

  sendreusablePipeline : BehaviorSubject<any> = new BehaviorSubject([]);
  sendreusableConfig : BehaviorSubject<any> = new BehaviorSubject([]);

  SendProject: BehaviorSubject<any> = new BehaviorSubject({});
  

  constructor() { }
}
