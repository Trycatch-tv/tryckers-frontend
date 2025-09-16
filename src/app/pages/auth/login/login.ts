import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [InputTextModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export default class Login {
  value: string = '';
}
