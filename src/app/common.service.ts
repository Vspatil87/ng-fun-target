import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  winner = new BehaviorSubject<any>(null);
  lastWinners = new BehaviorSubject<any>(null);

  constructor() { }
}
