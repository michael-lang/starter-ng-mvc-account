import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observe } from '../utility/observe_decorators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'lf-title',
  template: `<!-- no visible title element, in head only -->`,
  styles: ['']
})
export class LfTitleComponent implements OnInit {
  @Observe.OnDestroy() onDestroy$: Observable<void>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public titleService: Title
  ) { }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .startWith(null)
      .distinctUntilChanged()
      .takeUntil(this.onDestroy$)
      .subscribe((event) => {
        if (event !== null && event  !== undefined && event.title !== null) {
          this.titleService.setTitle(event.title);
        }
      });
  }
}
