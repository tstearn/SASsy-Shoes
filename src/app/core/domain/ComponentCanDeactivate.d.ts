import {Observable} from "rxjs/Observable";

interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
