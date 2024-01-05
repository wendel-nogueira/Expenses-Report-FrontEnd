import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { fieldStaffGuard } from './field-staff.guard';

describe('fieldStaffGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => fieldStaffGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
