import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';
import { UxMetricsService } from '@shared/services/ux-metrics.service';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';
import CarteleraPage from './cartelera-page';

describe('CarteleraPage', () => {
  let postsServiceSpy: jasmine.SpyObj<PostsService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let uxMetrics: UxMetricsService;

  const samplePosts: Post[] = [
    {
      id: 'p-1',
      title: 'Post menos votado',
      content: 'Contenido 1',
      image: '',
      tags: [],
      type: 'regular',
      status: 'published',
      created_at: new Date('2026-11-20T10:00:00Z'),
      updated_at: new Date('2026-11-20T10:00:00Z'),
      user_id: 'u-1',
      votes_count: 2,
      author: { id: 'u-1', username: 'alice' },
    },
    {
      id: 'p-2',
      title: 'Post más votado',
      content: 'Contenido 2',
      image: '',
      tags: [],
      type: 'regular',
      status: 'published',
      created_at: new Date('2026-11-21T10:00:00Z'),
      updated_at: new Date('2026-11-21T10:00:00Z'),
      user_id: 'u-2',
      votes_count: 10,
      author: { id: 'u-2', username: 'bob' },
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    postsServiceSpy = jasmine.createSpyObj<PostsService>('PostsService', [
      'getCartelera',
      'votePost',
    ]);
    notificationSpy = jasmine.createSpyObj<NotificationService>(
      'NotificationService',
      ['success', 'error', 'warning', 'info'],
    );

    TestBed.configureTestingModule({
      imports: [CarteleraPage],
      providers: [
        provideRouter([]),
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        UxMetricsService,
      ],
    });

    uxMetrics = TestBed.inject(UxMetricsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('carga posts y los ordena por votos descendentemente', async () => {
    postsServiceSpy.getCartelera.and.resolveTo(samplePosts);

    const fixture = TestBed.createComponent(CarteleraPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.componentInstance.errorMessage).toBeNull();
    expect(fixture.componentInstance.posts.length).toBe(2);
    expect(fixture.componentInstance.posts[0].id).toBe('p-2');
  });

  it('muestra estado vacío informativo sin error cuando no hay publicaciones', async () => {
    postsServiceSpy.getCartelera.and.resolveTo([]);

    const fixture = TestBed.createComponent(CarteleraPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.errorMessage).toBeNull();
    expect(fixture.componentInstance.posts.length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No hay posts populares esta semana');
  });

  it('no dispara estado de error si UxMetricsService falla al persistir en localStorage (AC-10)', async () => {
    postsServiceSpy.getCartelera.and.resolveTo(samplePosts);
    spyOn(uxMetrics, 'track').and.throwError('QuotaExceededError');

    const fixture = TestBed.createComponent(CarteleraPage);
    await fixture.componentInstance.loadCartelera();

    expect(fixture.componentInstance.errorMessage).toBeNull();
    expect(fixture.componentInstance.posts.length).toBe(2);
  });

  it('distingue errores de servidor y conectividad y recupera correctamente con Reintentar', async () => {
    postsServiceSpy.getCartelera.and.rejectWith(
      new HttpErrorResponse({ status: 503, statusText: 'Service Unavailable' }),
    );

    const fixture = TestBed.createComponent(CarteleraPage);
    await fixture.componentInstance.loadCartelera();

    expect(fixture.componentInstance.errorType).toBe('server');
    expect(fixture.componentInstance.errorMessage).toContain('servidor');

    // Simular fallo de red
    postsServiceSpy.getCartelera.and.rejectWith(
      new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' }),
    );
    await fixture.componentInstance.loadCartelera();
    expect(fixture.componentInstance.errorType).toBe('network');

    // Recuperar al pulsar Reintentar
    postsServiceSpy.getCartelera.and.resolveTo(samplePosts);
    await fixture.componentInstance.loadCartelera();

    expect(fixture.componentInstance.errorMessage).toBeNull();
    expect(fixture.componentInstance.errorType).toBeNull();
    expect(fixture.componentInstance.posts.length).toBe(2);
  });
});
