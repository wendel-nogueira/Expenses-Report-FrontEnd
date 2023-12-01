import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAccountListComponent } from './expense-account-list.component';

describe('ExpenseAccountListComponent', () => {
  let component: ExpenseAccountListComponent;
  let fixture: ComponentFixture<ExpenseAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
