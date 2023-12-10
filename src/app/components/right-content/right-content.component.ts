import { Component, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-right-content',
  templateUrl: './right-content.component.html',
  styleUrls: ['./right-content.component.scss']
})
export class RightContentComponent {

  timer: any;
  lastWinners: any = [];
  userDetails: any;

  constructor(private _electronService: ElectronService,
    private cdr: ChangeDetectorRef, private commonService: CommonService) {

    let details = localStorage.getItem('user');
    if (details) {
      this.userDetails = JSON.parse(details);
    }

    this._electronService.ipcRenderer.send("getLastWin", this.userDetails.uid);
    this._electronService.ipcRenderer.send("getTime", this.userDetails.uid);
    this._electronService.ipcRenderer.send("getWinners");
    this.getWinner();

    this._electronService.ipcRenderer.on("lastWinner", (event, result) => {
      if (result) {
        this.lastWinners = result;
      } else {
        this.lastWinners = [];
      }
      this.cdr.detectChanges();
    });

    this._electronService.ipcRenderer.on("timer", (event, result) => {
      this.timer = result;
      this.cdr.detectChanges();
    });
  }

  getWinner(): void {
    this._electronService.ipcRenderer.on("winners", (event, winners) => {
      winners.forEach((winner: any) => {
        if (winner.uid === this.userDetails.uid) {
          this.commonService.winner.next(winner.number);
        }
      });
    })
  }
}
