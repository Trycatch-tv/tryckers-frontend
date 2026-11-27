import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
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

  it('should create and display the formatted app version and build commit', () => {
    expect(component).toBeTruthy();
    const versionEl: HTMLElement | null =
      fixture.nativeElement.querySelector('.app-version');
    expect(versionEl).toBeTruthy();
    expect(versionEl?.textContent?.trim()).toBe(
      `v${environment.appVersion} · build ${environment.buildCommit}`,
    );
  });
});
