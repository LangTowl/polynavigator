import { TestBed } from '@angular/core/testing';

import { GetMapService } from './get-map.service';

describe('GetMapService', () => {
  let service: GetMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
