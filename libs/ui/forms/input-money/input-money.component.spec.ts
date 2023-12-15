import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputMoneyComponent } from './input-money.component';

describe('InputMoneyComponent', () => {
  let component: InputMoneyComponent;
  let fixture: ComponentFixture<InputMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputMoneyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
