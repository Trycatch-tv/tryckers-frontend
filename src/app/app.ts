import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'tryckers-frontend';
}
