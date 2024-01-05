import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseEvaluateComponent } from './expense-evaluate.component';

describe('ExpenseEvaluateComponent', () => {
  let component: ExpenseEvaluateComponent;
  let fixture: ComponentFixture<ExpenseEvaluateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseEvaluateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
