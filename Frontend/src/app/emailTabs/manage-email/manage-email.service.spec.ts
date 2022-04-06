import { TestBed } from '@angular/core/testing';

import { ManageEmailService } from './manage-email.service';

describe('ManageEmailService', () => {
  let service: ManageEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
