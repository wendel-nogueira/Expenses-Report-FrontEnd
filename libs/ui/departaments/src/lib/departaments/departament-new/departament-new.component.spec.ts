import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartamentNewComponent } from './departament-new.component';

describe('DepartamentNewComponent', () => {
  let component: DepartamentNewComponent;
  let fixture: ComponentFixture<DepartamentNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartamentNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
