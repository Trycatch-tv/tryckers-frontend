import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { setupTestBedWithRouter } from '../test-helpers';

describe('App', () => {
  beforeEach(async () => {
    const { providers } = setupTestBedWithRouter();
    
    await TestBed.configureTestingModule({
      imports: [App],
      providers: providers
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
