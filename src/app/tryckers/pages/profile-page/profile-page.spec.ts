import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TryckersService } from '@tryckers/services/tryckers-service';
import { PostsService } from 'src/app/post/services/posts.service';
import { of } from 'rxjs';
import ProfilePage from './profile-page';
import { setupTestBedWithRouter } from '../../../../test-helpers';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let tryckersServiceMock: jasmine.SpyObj<TryckersService>;
  let postsServiceMock: jasmine.SpyObj<PostsService>;

  beforeEach(async () => {
    tryckersServiceMock = jasmine.createSpyObj('TryckersService', ['getTryckerByUsername']);
    postsServiceMock = jasmine.createSpyObj('PostsService', ['getPostsByUserId', 'createPost', 'updatePost', 'deletePost']);

    tryckersServiceMock.getTryckerByUsername.and.returnValue(Promise.resolve({} as any));
    postsServiceMock.getPostsByUserId.and.returnValue(Promise.resolve([]));

    const { providers } = setupTestBedWithRouter({ username: 'testuser' });

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        ...providers,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TryckersService, useValue: tryckersServiceMock },
        { provide: PostsService, useValue: postsServiceMock }
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
