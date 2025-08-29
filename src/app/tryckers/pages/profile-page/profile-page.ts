import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  standalone: true,
})
export default class ProfilePage implements OnInit {
  username: string = '';

  constructor(private route: ActivatedRoute) {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  ngOnInit() {
    // Initialization logic here
    console.log('Profile page for user:', this.username);
  }
}
