import {Component} from "@angular/core";
@Component({
  selector: 'sassy-navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['./navbar.less']
})
export class NavBar {
  activeScreen: string = "home";

  setActive(value: string) {
    this.activeScreen = value;
  }
}
