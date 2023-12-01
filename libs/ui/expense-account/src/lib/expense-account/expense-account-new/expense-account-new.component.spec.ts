import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAccountNewComponent } from './expense-account-new.component';

describe('ExpenseAccountNewComponent', () => {
  let component: ExpenseAccountNewComponent;
  let fixture: ComponentFixture<ExpenseAccountNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAccountNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
