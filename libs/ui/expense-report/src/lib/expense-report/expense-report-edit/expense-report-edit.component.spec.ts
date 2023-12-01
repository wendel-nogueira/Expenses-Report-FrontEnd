import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseReportEditComponent } from './expense-report-edit.component';

describe('ExpenseReportEditComponent', () => {
  let component: ExpenseReportEditComponent;
  let fixture: ComponentFixture<ExpenseReportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseReportEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
