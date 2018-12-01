import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../../../../providers/auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	
	constructor(private authService: AuthService) { }
	
  @Output() showSignUp = new EventEmitter();
	@Output() onLogin = new EventEmitter<{credentials: string, password: string}>();
	@Input() loginInvalid = false;
	private _stageIndex = 0;
	private _done = false;
	private _indicatorLenght = 0;
	
	showLogin() {
		this.showSignUp.emit();
  }
  
  get stageIndex(): number {
    return this._stageIndex;
  }

  set stageIndex(value: number) {
    this._stageIndex = value;
  }
  get done(): boolean {
    return this._done;
  }

  set done(value: boolean) {
    this._done = value;
  }
  get indicatorLenght(): number {
    return this._indicatorLenght;
  }

  set indicatorLenght(value: number) {
    this._indicatorLenght = value;
  }
  
  stages = [
    {
      placeholder: 'Name',
      value: '',
      checked: false,
      validationRul: 'text',
      inputType: 'name',
      inputName: 'name',
    },
    {
      placeholder: 'Password',
      value: '',
      checked: false,
      validationRul: 'text',
      inputType: 'password',
      inputName: 'password'
    },
  ];
  

  setStageValue($event) {
    const curStage = this.getCurrentStageData();
    const enteredValue = $event.target.value;

    if (curStage.value === '' && $event.key === 'Backspace') { // if no value given (input empty) and backspace pushed: go back
      this.back();
    }

    curStage.value = enteredValue;
    this.validateStage(curStage);
    this.paintIndicator();
  }

  validateStage(stage) {
    if (stage.value !== '') {
        stage.checked = true;
        return;
    }
    stage.checked = false;
  }
  paintIndicator() {
    const stagesCount = this.stages.length;
    let validStagesCount = 0;
    for (const stage of this.stages) {
      if (stage.checked === true) {
          ++validStagesCount;
      }
    }
      this.indicatorLenght = 100 / stagesCount * (validStagesCount);
  }


  stageIsValid(stageData) {
    return stageData.checked;
  }

  getCurrentStageData() {
    return this.stages[this.stageIndex];
  }

  next() {
    if (this.stageIndex < this.stages.length - 1) { // prevent out of bounce in stages
      this.stageIndex = this.stageIndex + 1; // move to the next step
    }
    if (this.allChecked()) {
      this.done = true;
      this.handleInput();
    }
  }
  back() {
    const curStage = this.getCurrentStageData();
    curStage.checked = false;
    this.loginInvalid = false; // if login failed once paint stage line blue again
    if (this.stageIndex > 0) { // prevent out of bounce
      this.stageIndex = this.stageIndex - 1;
    }
  }
  backVisible() {
    let visible = false;
    const curStage = this.getCurrentStageData();

    if (this.stageIndex > 0 && this.stageIsValid(curStage)) {
      visible = true;
    }
    return visible;
  }
  
  // sends login data from here
  handleInput() {
    const user = this.stages[0].value;
    const password = this.stages[1].value;
    this.onLogin.next({credentials: user, password: password});
    // this.authService.login({credentials: user, password: password})
    //   .then()
    //   .catch(() => {
    //     this.loginInvalid = true;
    //   });
  }
  
  private getValueOf(_inputName: string) {
    const _input = this.stages.find(input => input.inputName === _inputName);
    return _input.value;
  }

  getInputData() {
      const validStagesValues = {};
      for (const stage of this.stages) {
          const inputName = stage.inputName;
          validStagesValues[inputName] = stage.value; // {Password: xyz}, {Name: mueller}
      }
      return validStagesValues;
  }
  
  allChecked() {
    let flag = true;
    for (const stage of this.stages) {
      if (stage.checked === false) {
        flag = false;
      }
    }
    return flag;
  }

  ngOnInit() {}

}
