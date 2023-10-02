import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/src/lib/header/header.component';
import { HeaderMobileComponent } from '../header-mobile/src/lib/header-mobile/header-mobile.component';
import { FooterComponent } from '../footer/src/lib/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'lib-master-page',
  standalone: true,
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    HeaderMobileComponent,
    FooterComponent,
    MatSidenavModule,
  ],
})
export class MasterPageComponent {
  isMobile = false;

  onResize(event: UIEvent) {
    this.isMobile = window.innerWidth <= 768;
  }
}
