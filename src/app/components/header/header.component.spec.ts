import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header element', () => {
    const headerElement = fixture.nativeElement.querySelector('app-header');
    expect(headerElement).toBeTruthy();
  });

  it('should display brand text', () => {
    fixture.detectChanges();

    const brandText = fixture.nativeElement.textContent;
    expect(brandText).toContain('Tryckers');
  });

  it('should navigate to home on brand click', () => {
    component.navigateTo('/');

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display navigation menu', () => {
    fixture.detectChanges();

    const menubar = fixture.nativeElement.querySelector('p-menubar');
    expect(menubar).toBeTruthy();
  });
});

