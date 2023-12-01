import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAccountEditComponent } from './expense-account-edit.component';

describe('ExpenseAccountEditComponent', () => {
  let component: ExpenseAccountEditComponent;
  let fixture: ComponentFixture<ExpenseAccountEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAccountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
