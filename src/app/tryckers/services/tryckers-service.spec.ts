import { TestBed } from '@angular/core/testing';

import { TryckersService } from './tryckers-service';

describe('TryckersService', () => {
  let service: TryckersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TryckersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
