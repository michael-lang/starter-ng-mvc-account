import { async, TestBed } from '@angular/core/testing';
import { Component, OnDestroy } from '@angular/core';
import { Observe } from './observe_decorators';
import { Observable } from 'rxjs/Observable';


describe('Observe', () => {
    describe('Observe.OnDestroy', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [TestOnDestroyComponent, DerivedTestOnDestroyComponent]
            })
                .compileComponents();
        }));

        it('It should observe OnDestroy, and also call existing ngOnDestroy', () => {
            const fixture = TestBed.createComponent(TestOnDestroyComponent);
            const component = fixture.componentInstance;
            fixture.detectChanges();
            expect(component.count).toBe(0);
            fixture.destroy();

            expect(component.count).toBe(3);
            expect(component.emitted).toBe(1);
            expect(component.completed).toBe(2);
            expect(component.manual).toBe(3);

        });

        it('It should observe OnDestroy, and also call super ngOnDestroy', () => {
            const fixture = TestBed.createComponent(DerivedTestOnDestroyComponent);
            const component = fixture.componentInstance;
            fixture.detectChanges();
            expect(component.count).toBe(0);
            fixture.destroy();

            expect(component.count).toBe(3);
            expect(component.emitted).toBe(1);
            expect(component.completed).toBe(2);
            expect(component.manual).toBe(3);

        });

        @Component({
            selector: 'lf-test-on-destroy',
            template: ''
        })
        class TestOnDestroyComponent implements OnDestroy {
            @Observe.OnDestroy() onDestroy$: Observable<void>;

            count = 0;
            emitted: number;
            completed: number;
            manual: number;

            constructor() {
                this.onDestroy$.subscribe(
                    () => this.emitted = ++this.count,
                    () => fail('emitted error'),
                    () => this.completed = ++this.count
                );
            }

            ngOnDestroy() {
                this.manual = ++this.count;
            }
        }
    });

    class BaseSuperTestOnDestroyComponent implements OnDestroy {
        count = 0;
        manual: number;

        constructor() {
        }

        ngOnDestroy() {
            this.manual = ++this.count;
        }
    }

    @Component({
        selector: 'lf-derived-test-on-destroy',
        template: ''
    })
    class DerivedTestOnDestroyComponent extends BaseSuperTestOnDestroyComponent {
        @Observe.OnDestroy() onDestroy$: Observable<void>;
        emitted: number;
        completed: number;

        constructor() {
            super();
            this.onDestroy$.subscribe(
                () => this.emitted = ++this.count,
                () => fail('emitted error'),
                () => this.completed = ++this.count
            );
        }
    }
});
