import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankaccountComponent } from './add-bankaccount.component';

describe('AddBankaccountComponent', () => {
  let component: AddBankaccountComponent;
  let fixture: ComponentFixture<AddBankaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
