import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Post } from './post';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';

describe('Post', () => {
  let component: Post;
  let fixture: ComponentFixture<Post>;
  let postsService: jasmine.SpyObj<PostsService>;
  let activatedRoute: any;

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', [
      'getPostById',
      'updatePost',
      'deletePost',
    ]);

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.callFake((key: string) => {
            if (key === 'id') return '1';
            if (key === 'username') return 'testuser';
            return null;
          }),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [Post],
      providers: [
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    fixture = TestBed.createComponent(Post);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post on init', async () => {
    const mockPost = {
      id: '1',
      title: 'Test Post',
      content: 'Test Content',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date()
    } as any;

    postsService.getPostById.and.returnValue(Promise.resolve(mockPost));

    fixture.detectChanges();

    expect(postsService.getPostById).toHaveBeenCalledWith('1');
  });

  it('should display error message if post id is missing', () => {
    activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);

    fixture.detectChanges();

    expect(component.error).toBeTruthy();
  });

  it('should handle post load failure', fakeAsync(() => {
    postsService.getPostById.and.returnValue(
      Promise.reject(new Error('Failed to load post'))
    );

    fixture.detectChanges();
    tick();

    expect(component.error).toBeTruthy();
  }));
});
