import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simple-calendar';
  constructor(private router: Router) { }

  ngOnInit() {
    // Esto inicializa la navegacion del micro frontends por medio del router Angular.
    this.router.initialNavigation();
  }
}
