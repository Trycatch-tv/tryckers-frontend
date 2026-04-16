import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { UxMetricsService } from '@shared/services/ux-metrics.service';
import { PostsService } from '../../services/posts.service';

import { Post } from './post';

describe('Post', () => {
  let component: Post;
  let fixture: ComponentFixture<Post>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Post],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1', username: 'test-user' }),
              queryParamMap: convertToParamMap({}),
            },
          },
        },
        {
          provide: PostsService,
          useValue: {
            getPostById: jasmine.createSpy().and.resolveTo(null),
            votePost: jasmine.createSpy(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            success: jasmine.createSpy(),
            error: jasmine.createSpy(),
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

    fixture = TestBed.createComponent(Post);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
