import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AccountantGuard } from './accountant.guard';

describe('accountantGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AccountantGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
