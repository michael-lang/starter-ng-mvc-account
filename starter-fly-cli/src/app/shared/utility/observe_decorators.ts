import { Subject } from 'rxjs/Subject';

//TODO add decorators for other lifecycle events
export class Observe {
    /**
     * Creates an observable that is emitted and completed when the
     * angular OnDestroy lifecycle event occurs.
     *
     * Usage: @Observe.OnDestroy() onDestroy$: Observable<void>;
     *
     */
    static OnDestroy() {
        return function (target: any, propertyKey: string): any {
            const subject = new Subject<void>();
            target[propertyKey] = subject.asObservable();

            const noop = () => { };
            const originalOnDestroy = (target.ngOnDestroy || noop);
            target.ngOnDestroy = function () { //no => so we get target's this
                subject.next();
                subject.complete();
                originalOnDestroy.call(this);
            };

            return {
                value: subject.asObservable()
            };
        };
    }
}
