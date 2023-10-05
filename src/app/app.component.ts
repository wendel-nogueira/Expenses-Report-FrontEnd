import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'handson';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "arrow_line_left",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/arrow-line-left-light.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "arrow_line_right",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/arrow-line-right-light.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "buildings",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/buildings-light.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "folder",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/folder-light.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "receipt",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/receipt-light.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "users",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/users-light.svg")
    );
  }
}
