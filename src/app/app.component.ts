import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'expenses report';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'arrow_line_left',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/arrow-line-left-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'arrow_line_right',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/arrow-line-right-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'buildings',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/buildings-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'folder',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/folder-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'receipt',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/receipt-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'users',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/users-regular.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'house',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/house-regular.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/magnifying-glass-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'add',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/plus-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'cancel',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/x-bold.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/pencil-light.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'trash',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/trash-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'check',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/check-bold.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'eye',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/eye.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'eye-slash',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/eye-slash.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'sign-out',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/sign-out.svg'
      )
    );
    
    this.matIconRegistry.addSvgIcon(
      'gear',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/gear.svg'
      )
    );
  }
}
