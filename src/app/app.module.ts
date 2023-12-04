import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WheelComponent } from './components/wheel/wheel.component';
import { HeaderComponent } from './components/header/header.component';
import { BetButtonsComponent } from './components/bet-buttons/bet-buttons.component';
import { RightContentComponent } from './components/right-content/right-content.component';
import { BetNumbersComponent } from './components/bet-numbers/bet-numbers.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GameAppComponent } from './components/game-app/game-app.component';

@NgModule({
  declarations: [
    AppComponent,
    WheelComponent,
    HeaderComponent,
    BetButtonsComponent,
    RightContentComponent,
    BetNumbersComponent,
    LoginPageComponent,
    GameAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
