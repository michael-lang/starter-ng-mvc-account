import { ChangeDetectorRef, OnDestroy, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

/**
* Base class for creating Pipes that work like AsyncPipe.
*
* Classes using this should just have to implement the abstract
* transformAsync method.
*
* If you override ngOnDestroy or transform, be sure to call super.*.
* Be sure to mark you pipe as impure (@Pipe({..., pure: false}.
*/
export abstract class AsyncPipeBase<T> implements OnDestroy, PipeTransform {
 private async: AsyncPipe;
 private last: { args: any[], transformed$: Observable<T> } = {
   args: [],
   transformed$: undefined
 };

 constructor(ref: ChangeDetectorRef) {
   this.async = new AsyncPipe(ref);
 }

 ngOnDestroy() {
   this.async.ngOnDestroy();
 }

 protected abstract transformAsync(value: any, ...args: any[]): Observable<T>;

 //AsyncPipe works by subscribing to the Observable when it is first
 //  passed to transform then triggering change detection when it emits.
 //  Since the pipe is marked as impure this causes transform to be
 //  called again.  AsyncPipe.transform will then check that the Observable
 //  hasn't changed and will return the value emitted previously.
 transform(value: any, ...args: any[]): T {
   if (!this.isSameArgs(arguments)) {
     this.last.args = Array.from(arguments);
     this.last.transformed$ = this.transformAsync(value, ...args);
   }
   return this.async.transform(this.last.transformed$);
 }

 private isSameArgs(args: IArguments) {
   return this.last.args.length === args.length
     && this.last.args.every((v, i) => args[i] === v);
 }
}
