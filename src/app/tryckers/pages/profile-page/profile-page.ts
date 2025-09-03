import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TryckersService } from '@tryckers/services/tryckers-service';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  standalone: true,
})
export default class ProfilePage implements OnInit {
  tryckersService = inject(TryckersService);

  username: string = '';
  user: any = null;

  constructor(private route: ActivatedRoute) {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  async getProfileData() {
    this.user = await this.tryckersService.getTryckerByUsername(this.username);
    this.user.interests = this.user.interests.split(',') || [];
  }

  ngOnInit() {
    this.getProfileData();
  }
}
