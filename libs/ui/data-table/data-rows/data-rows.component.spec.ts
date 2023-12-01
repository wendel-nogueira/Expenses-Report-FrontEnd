import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataRowsComponent } from './data-rows.component';

describe('DataRowsComponent', () => {
  let component: DataRowsComponent;
  let fixture: ComponentFixture<DataRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataRowsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
