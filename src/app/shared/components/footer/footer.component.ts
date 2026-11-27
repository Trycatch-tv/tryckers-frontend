import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  readonly appVersion = environment.appVersion || '0.0.0';
  readonly buildCommit = environment.buildCommit || 'local';
  readonly versionLabel = `v${this.appVersion} · build ${this.buildCommit}`;
}
