import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartamentsListComponent } from './departaments-list.component';

describe('DepartamentsListComponent', () => {
  let component: DepartamentsListComponent;
  let fixture: ComponentFixture<DepartamentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartamentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
