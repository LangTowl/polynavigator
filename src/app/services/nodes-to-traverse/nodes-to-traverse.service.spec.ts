import { TestBed } from '@angular/core/testing';

import { NodesToTraverseService } from './nodes-to-traverse.service';

describe('NodesToTraverseService', () => {
  let service: NodesToTraverseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodesToTraverseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
