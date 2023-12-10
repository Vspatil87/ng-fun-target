import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';

declare let Winwheel: any;

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements AfterViewInit {

  theWheel: any;
  wheelSpinning = false;
  winner = false;
  winningNumber: any;
  winningNumberSub: Subscription;
  userDetails: any;
  wheelMusic = new Audio('./assets/audio/wheelStart.wav');

  constructor(private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private _electronService: ElectronService) {
    let details = localStorage.getItem('user');
    if (details) {
      this.userDetails = JSON.parse(details);
    }
    this.winningNumberSub = this.commonService.winner.subscribe(value => {
      this.winningNumber = value;
    })

    this._electronService.ipcRenderer.on("timer", (event, result) => {
      if (result <= 2 && this.winningNumber) {
        // Play before wheel start to spin
        this.wheelMusic.currentTime = 0;
        this.wheelMusic.play();
      }
      if (result <= 1 && this.winningNumber) {
        this.calculatePrize();
      }
    });
  }

  ngAfterViewInit(): void {
    this.theWheel = new Winwheel({
      numSegments: 10,
      outerRadius: 212,
      innerRadius: 80,  // Set inner radius to make wheel hollow.
      centerX: 217,
      centerY: 219,
      textFontSize: 45,
      textFontFamily: 'Poppins-SemiBold',
      'responsive': true,  // This wheel is responsive!
      'imageOverlay': true,
      'textMargin': 5,
      'textOrientation': 'curved',
      segments:
        [
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '1' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '2' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '3' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '4' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '5' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '6' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '7' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '8' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '9' },
          { textFillStyle: '#ffffff', fillStyle: '#5ABA20', text: '0' }
        ],
      animation:
      {
        type: 'spinToStop',
        duration: 7,
        spins: 10,
        callbackFinished: this.alertPrize.bind(this)
      },
      pointerGuide:
      {
        display: false,
        strokeStyle: 'red',
        lineWidth: 3
      }
    });
  }

  startSpin(): void {
    this.theWheel.rotationAngle = 0;
    this.theWheel.startAnimation();
    this.wheelSpinning = true;
    setTimeout(() => {
      this.wheelMusic.pause();
    }, 6000);
  }

  resetWheel(): void {
    this.winner = false;
    this.theWheel.stopAnimation(false);
    this.theWheel.rotationAngle = 0;
    this.theWheel.draw();
    this.wheelSpinning = false;
  }

  alertPrize(): void {
    this.winner = true;
    this.theWheel.draw();
    this._electronService.ipcRenderer.send("getLastWin", this.userDetails.uid);
    this.cdr.detectChanges();
  }

  calculatePrize(): void {
    this.resetWheel();
    // This formula always makes the wheel stop somewhere inside prize 3 at least
    // 1 degree away from the start and end edges of the segment.
    // const stopAt = (91 + Math.floor((Math.random() * 43)));
    const start = this.theWheel.segments[this.winningNumber].startAngle;
    const end = this.theWheel.segments[this.winningNumber].endAngle;
    const angle = ((end - start) / 2);

    const stopAt = (start + angle);
    // const stopAt = this.getStopAt();
    // console.log('Stop at angle must lie between 90 and 135 degrees - ', stopAt);
    // Important thing is to set the stopAngle of the animation before stating the spin.
    this.theWheel.animation.stopAngle = stopAt;
    // May as well start the spin from here.
    this.startSpin();
    // this.theWheel.animation.callbackFinished = console.log('This after animation ends - ', this.theWheel.getIndicatedSegment());
  }

  ngOnDestroy(): void {
    this.winningNumberSub.unsubscribe();
  }
}
