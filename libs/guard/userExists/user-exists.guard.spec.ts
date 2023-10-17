import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userExistsGuard } from './user-exists.guard';

describe('userExistsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userExistsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
