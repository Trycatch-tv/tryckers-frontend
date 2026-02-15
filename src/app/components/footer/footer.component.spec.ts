import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display footer text', () => {
    fixture.detectChanges();

    const footerText = fixture.nativeElement.textContent;
    expect(footerText).toContain('©');
  });

  it('should display social media links', () => {
    fixture.detectChanges();

    const socialLinks = fixture.nativeElement.querySelectorAll('p-button[data-testid*="social-"]');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('should have correct year in footer', () => {
    fixture.detectChanges();

    const currentYear = new Date().getFullYear();
    const footerText = fixture.nativeElement.textContent;
    expect(footerText).toContain(currentYear.toString());
  });
});
