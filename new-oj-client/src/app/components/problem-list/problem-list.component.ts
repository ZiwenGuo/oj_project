import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data/data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[];
  private subscription : Subscription = new Subscription();
  constructor(private dataSerivce: DataService) { }

  // home work add unsubscribe in ngOnDestroy

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.getProblems();
  }

  getProblems(): void {
    this.subscription.add(this.dataSerivce.getProblems()
      .subscribe(problems => this.problems = problems));
  }

}