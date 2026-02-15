import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { PostsService } from 'src/app/post/services/posts.service';
import { of } from 'rxjs';
import ProfilePage from './profile-page';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let tryckersServiceMock: jasmine.SpyObj<TryckersService>;
  let postsServiceMock: jasmine.SpyObj<PostsService>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    tryckersServiceMock = jasmine.createSpyObj('TryckersService', ['getTryckerByUsername']);
    postsServiceMock = jasmine.createSpyObj('PostsService', ['getPostsByUserId', 'createPost', 'updatePost', 'deletePost']);
    activatedRouteMock = {
      params: of({ username: 'testuser' }),
      snapshot: { 
        params: { username: 'testuser' },
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('testuser')
        }
      }
    };

    tryckersServiceMock.getTryckerByUsername.and.returnValue(Promise.resolve({} as any));
    postsServiceMock.getPostsByUserId.and.returnValue(Promise.resolve([]));

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TryckersService, useValue: tryckersServiceMock },
        { provide: PostsService, useValue: postsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
