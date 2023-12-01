import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseReportNewComponent } from './expense-report-new.component';

describe('ExpenseReportNewComponent', () => {
  let component: ExpenseReportNewComponent;
  let fixture: ComponentFixture<ExpenseReportNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseReportNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseReportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
