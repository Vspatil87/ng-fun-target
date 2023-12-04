import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private _electronService: ElectronService) { }

  logout(): void {
    localStorage.clear();
    this._electronService.ipcRenderer.send("logout");
  }

}
