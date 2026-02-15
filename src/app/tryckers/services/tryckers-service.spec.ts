import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TryckersService } from './tryckers-service';

describe('TryckersService', () => {
  let service: TryckersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(TryckersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
