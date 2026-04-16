import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { AuthStore } from '@auth/store/auth-store';
import { PostsService } from 'src/app/post/services/posts.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UxMetricsService } from 'src/app/shared/services/ux-metrics.service';
import { TryckersService } from '../../services/tryckers-service';

import ProfilePage from './profile-page';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ username: 'test-user' }),
              queryParamMap: convertToParamMap({ page: '1' }),
            },
          },
        },
        {
          provide: AuthStore,
          useValue: {
            user: jasmine
              .createSpy()
              .and.returnValue({ username: 'test-user' }),
            isLoggedIn: jasmine.createSpy().and.returnValue(true),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy().and.resolveTo(true),
          },
        },
        {
          provide: TryckersService,
          useValue: {
            getTryckerByUsername: jasmine.createSpy().and.resolveTo(null),
          },
        },
        {
          provide: PostsService,
          useValue: {
            getPostsByUserId: jasmine.createSpy().and.resolveTo([]),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            success: jasmine.createSpy(),
            error: jasmine.createSpy(),
            warning: jasmine.createSpy(),
            info: jasmine.createSpy(),
          },
        },
        {
          provide: UxMetricsService,
          useValue: {
            startTiming: jasmine.createSpy(),
            endTiming: jasmine.createSpy(),
            track: jasmine.createSpy(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
