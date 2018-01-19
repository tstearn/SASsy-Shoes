import {Component} from "@angular/core";
@Component({
  selector: 'sassy-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavBarComponent {
  activeScreen: string = "home";

  setActive(value: string) {
    this.activeScreen = value;
  }
}
