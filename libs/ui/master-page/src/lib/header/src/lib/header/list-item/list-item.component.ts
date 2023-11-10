import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-list-item',
  standalone: true,
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
  imports: [CommonModule, MatIconModule, MatListModule, RouterModule],
})
export class ListItemComponent implements OnChanges {
  @Input() icon = '';
  @Input() text = '';
  @Input() show = true;
  @Input() link = '';
  @Input() items: Items[] = [];
  @Input() opened = false;
  @Input() useItens = true;
  @Input() effect = false;
  @Output() onclick = new EventEmitter();
  @Output() onclickLink = new EventEmitter();

  isCollapsed = false;
  showOptions = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opened']) {
      this.showOptions = this.opened;
    }
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleOptions(): void {
    if (!this.useItens) return;

    this.showOptions = !this.showOptions;
  }

  onClick(): void {
    this.onclick.emit();
  }

  onClickLink(isPrincipal: boolean): void {
    if (isPrincipal && this.useItens) return;

    this.toggleOptions();
    this.onclickLink.emit();
  }
}

export interface Items {
  text: string;
  link: string;
  show: boolean;
}
