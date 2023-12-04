import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  username: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(private _electronService: ElectronService,
    private _router: Router) {
  }

  login(): void {
    if (this._electronService.isElectronApp) {
      let obj = {
        username: this.username,
        password: this.password
      }
      this._electronService.ipcRenderer.send("authenticate", obj);
    }

    this._electronService.ipcRenderer.on("authResponse", (event, result) => {
      if (result && result.status === 'success') {
        localStorage.setItem('user', JSON.stringify(result.user));
        this._router.navigateByUrl('game-app');
      } else {
        this.errorMsg = result.status;
      }
    });
  }
}
