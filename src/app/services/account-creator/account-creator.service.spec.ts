import { TestBed } from '@angular/core/testing';

import { AccountCreatorService } from './account-creator.service';

describe('AccountCreatorService', () => {
  let service: AccountCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
