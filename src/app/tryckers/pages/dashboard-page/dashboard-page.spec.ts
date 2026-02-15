import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { DashboardPage } from './dashboard-page';
import { of } from 'rxjs';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let tryckersServiceMock: jasmine.SpyObj<TryckersService>;

  beforeEach(async () => {
    tryckersServiceMock = jasmine.createSpyObj('TryckersService', ['getTryckers']);
    tryckersServiceMock.getTryckers.and.returnValue(Promise.resolve([]));

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TryckersService, useValue: tryckersServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
