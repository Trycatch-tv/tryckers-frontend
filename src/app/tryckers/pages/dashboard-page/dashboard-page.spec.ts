import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { DashboardPage } from './dashboard-page';
import { setupTestBedWithRouter } from '../../../../test-helpers';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let tryckersServiceMock: jasmine.SpyObj<TryckersService>;

  beforeEach(async () => {
    tryckersServiceMock = jasmine.createSpyObj('TryckersService', ['getTryckers']);
    tryckersServiceMock.getTryckers.and.returnValue(Promise.resolve([]));

    const { providers } = setupTestBedWithRouter();

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        ...providers,
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
