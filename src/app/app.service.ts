import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface HallInterface {
  secondsLeft: number;
}

@Injectable({
  providedIn: 'root',
})

export class AppService {
  constructor(private http: HttpClient) {}

  getDeadline() {
    return this.http.get<HallInterface>('/assets/dummy.json');
  }
}
