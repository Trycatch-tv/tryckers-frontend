import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export default class Login {
  value: string = '';
}
