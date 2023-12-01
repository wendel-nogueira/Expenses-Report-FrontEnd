import { TestBed } from '@angular/core/testing';

import { ExpenseAccountService } from './expense-account.service';

describe('ExpenseAccountService', () => {
  let service: ExpenseAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
