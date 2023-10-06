import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-player-mobile',
  templateUrl: './player-mobile.component.html',
  styleUrls: ['./player-mobile.component.scss']
})
export class PlayerMobileComponent {
  @Input() image = "profile.png";
  @Input() name;
  @Input() playerActiv:boolean = false;
}
