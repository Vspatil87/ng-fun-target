import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetNumbersComponent } from './bet-numbers.component';

describe('BetNumbersComponent', () => {
  let component: BetNumbersComponent;
  let fixture: ComponentFixture<BetNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetNumbersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
