import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { Trycker } from '@tryckers/interfaces';
import { TryckersService } from '../../services/tryckers-service';

import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        {
          provide: TryckersService,
          useValue: {
            getTryckers: jasmine.createSpy().and.resolveTo([]),
            mediaUrl: jasmine.createSpy().and.returnValue(''),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            error: jasmine.createSpy(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /profile using username instead of full name', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const trycker = {
      id: 'cb304ebe-2189-4d0c-b53e-a5ea4f14b939',
      username: 'Tony13TV',
      name: 'Cristian Torres',
    } as Trycker;

    component.viewProfile(trycker);

    expect(navigateSpy).toHaveBeenCalledWith(['/profile', 'tony13tv']);
  });

  it('should strip spaces when falling back to name if username is missing', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const trycker = {
      id: 'user-1',
      username: '',
      name: 'Cristian Torres',
    } as Trycker;

    component.viewProfile(trycker);

    expect(navigateSpy).toHaveBeenCalledWith(['/profile', 'cristiantorres']);
  });
});
