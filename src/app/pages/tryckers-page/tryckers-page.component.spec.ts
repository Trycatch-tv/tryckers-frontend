import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import TryckersPageComponent from './tryckers-page.component';
import { TryckersService } from '../../tryckers/services/tryckers-service';
import { AuthStore } from '../../auth/store/auth-store';
import { setupTestBedWithRouter } from '../../../test-helpers';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TryckersPageComponent', () => {
  let component: TryckersPageComponent;
  let fixture: ComponentFixture<TryckersPageComponent>;
  let tryckersService: jasmine.SpyObj<TryckersService>;
  let authStoreMock: any;

  beforeEach(async () => {
    const tryckersServiceSpy = jasmine.createSpyObj<TryckersService>([
      'getTryckers',
      'getTryckerByUsername',
      'getAuthToken',
    ]);

    authStoreMock = {
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
    };

    const { providers } = setupTestBedWithRouter();

    await TestBed.configureTestingModule({
      imports: [TryckersPageComponent],
      providers: [
        ...providers,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TryckersService, useValue: tryckersServiceSpy },
        { provide: AuthStore, useValue: authStoreMock },
      ],
    }).compileComponents();

    tryckersService = TestBed.inject(TryckersService) as jasmine.SpyObj<TryckersService>;

    fixture = TestBed.createComponent(TryckersPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and log initialization', () => {
    spyOn(console, 'log');
    
    component.ngOnInit();

    expect(console.log).toHaveBeenCalledWith(
      'TryckersPage initialized, isLoggedIn:',
      false
    );
  });

  it('should have login and register links when user is not logged in', () => {
    authStoreMock.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const loginLink = fixture.nativeElement.querySelector('a[routerLink="/auth/login"]');
    const registerLink = fixture.nativeElement.querySelector('a[routerLink="/auth/register"]');
    
    expect(loginLink).toBeTruthy();
    expect(registerLink).toBeTruthy();
  });
  it('should display welcome message when user is not logged in', () => {
    // Mock the authStore to return false for isLoggedIn
    authStoreMock.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const welcomeText = fixture.nativeElement.querySelector('h1');
    expect(welcomeText?.textContent?.trim()).toBe('Bienvenido a Tryckers');
  });

  it('should display dashboard when user is logged in', () => {
    // Mock the authStore to return true for isLoggedIn
    authStoreMock.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const dashboardElement = fixture.nativeElement.querySelector('app-dashboard-page');
    expect(dashboardElement).toBeTruthy();
  });
});
