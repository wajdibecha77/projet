import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTotalClientComponent } from './app-total-client.component';

describe('AppTotalClientComponent', () => {
  let component: AppTotalClientComponent;
  let fixture: ComponentFixture<AppTotalClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTotalClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTotalClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
