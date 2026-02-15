import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { Post, CreatePostDto } from '../interfaces/post';
import { environment } from 'src/environments/environment';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get auth token', () => {
    const token = service.getAuthToken();
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(token).toBe('mock-token');
  });

  it('should fetch single post by id', async () => {
    const mockPost: Post = { 
      id: '1', 
      title: 'Post 1', 
      content: 'Content 1',
      type: 'article',
      status: 'published' 
    } as any;

    const promise = service.getPostById('1');

    const req = httpMock.expectOne(`${environment.baseUrl}/posts/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockPost);

    const result = await promise;
    expect(result).toEqual(mockPost);
  });

  it('should create new post', async () => {
    const newPost: CreatePostDto = { 
      title: 'New Post', 
      content: 'New Content',
      type: 'article',
      image: '',
      tags: '',
      status: 'published',
      user_id: '1'
    };
    const mockResponse: Post = { id: '3', ...newPost } as any;

    const promise = service.createPost(newPost);

    const req = httpMock.expectOne(`${environment.baseUrl}/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should delete post', async () => {
    const promise = service.deletePost('1');

    const req = httpMock.expectOne(`${environment.baseUrl}/posts/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush({});

    const result = await promise;
    expect(result).toBe(true);
  });

  it('should get posts by user id', async () => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Post 1', content: 'Content 1', user_id: 'user1' } as any,
      { id: '2', title: 'Post 2', content: 'Content 2', user_id: 'user1' } as any,
    ];

    const promise = service.getPostsByUserId('user1');

    const req = httpMock.expectOne(`${environment.baseUrl}/users/user1/posts`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockPosts);

    const result = await promise;
    expect(result).toEqual(mockPosts);
  });
});
