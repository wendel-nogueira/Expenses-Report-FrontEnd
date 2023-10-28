import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AccountantAndManagerGuard } from './accountant-and-manager.guard';

describe('accountantAndManagerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AccountantAndManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
