import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-expandable-panel',
  templateUrl: './expandable-panel.component.html',
  styleUrls: ['./expandable-panel.component.css'],
  animations: [
    trigger('panelState', [
      state('collapsed', style({
        'height': '0px',
        'margin': '0px',
        'padding': '0px',
        'overflow' : 'hidden'

      })),
      state('expanded',   style({
        'height': '*',
        'margin': '*',
        'padding': '*',
        'overflow': '*'
      })),

      transition('collapsed <=> expanded', animate(300))

    ])
  ]
})
export class ExpandablePanelComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public scrollBars = false;
  public iconClass;
  public collapsedIcon = 'glyphicon-plus-sign';
  public expandedIcon = 'glyphicon-minus-sign';

  public state = 'collapsed';
  constructor() { }

  ngOnInit() {
    this.toggleState();
  }

  getStyle() {
    if (this.scrollBars) {
      return 'overflow: auto; max-height:650px; padding:0; margin:0;';
    }
    return `padding:0; margin:0;`;
  }

  toggleState() {
    if (this.state === 'collapsed') {
      this.state = 'expanded';
    } else {
      this.state = 'collapsed';
    }

    this.updateIcon();
  }

  private updateIcon() {
    this.iconClass = this.state === 'collapsed' ? this.collapsedIcon : this.expandedIcon;
  }
}
