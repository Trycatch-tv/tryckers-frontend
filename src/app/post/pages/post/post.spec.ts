import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Post } from './post';

describe('Post', () => {
  let component: Post;
  let fixture: ComponentFixture<Post>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Post]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Post);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
