import { ApiService } from './../services/api.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cadQuestion';

  cadQuestion = {
    modules_idModule: 1,
    level: 1,
    floor: '',
    questionNum: '',
    bonus: 0,
    questionType: '',
    question: '',
    answerC1: '',
    answerC2: '',
    answerE1: '',
    answerE2: '',
    answerE3: '',
  }

  cadExplanation = {
    questions_idQuestion: 0,
    explanation: '',
    imgFlowchart: ''
  }

  cadLink = {
    explanations_questions_idQuestion: 0,
    linkType: '',
    link: ''
  }

  modules = [
    {
      idModule: '',
      moduleName: ''
    }
  ]

  constructor(
    private apiServ: ApiService
  ) { }

  ngOnInit(): void {
    this.apiServ.getModules().subscribe(data => {this.modules = data})
  }

  postQuestion() {
    this.apiServ.postQuestion(this.cadQuestion).subscribe(
        data => console.log(data),
        err => console.log(err)
    )

    setTimeout(() => {
      this.cadQuestion.bonus = 0
      this.cadQuestion.modules_idModule = 1
      this.cadQuestion.level = 1
      this.cadQuestion.questionType = 'objective'
    }, 500);
  }

  postExplanation() {
    this.apiServ.postExplanation(this.cadExplanation).subscribe(
      data => console.log(data),
      err => console.log(err)
    )
  }

  postLink() {
    this.apiServ.postLink(this.cadLink).subscribe(
      data => console.log(data),
      err => console.log(err)
    )
  }
}
