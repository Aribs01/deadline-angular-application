import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AppService } from './app.service';
import { Subject, takeUntil, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  deadline = 0;
  secondsLeft = 0;

  protected unsubscribe$ = new Subject<void>();

  constructor(private appService: AppService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.appService
      .getDeadline()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deadline) => {
        this.deadline = deadline.secondsLeft;
        this.secondsLeft = this.deadline;

        this.startCountdown();
      });
  }

  startCountdown(): void {
    interval(1000)
      .pipe(
        map((seconds) => this.deadline - seconds),
        takeWhile((seconds) => seconds >= 0),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((seconds) => {
        this.secondsLeft = seconds;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
