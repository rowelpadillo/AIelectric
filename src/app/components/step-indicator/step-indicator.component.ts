import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KioskStateService } from '../../services/kiosk-state.service';

interface StepDef {
  num: number;
  label: string;
}

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.css']
})
export class StepIndicatorComponent {
  readonly steps: StepDef[] = [
    { num: 1, label: 'Account Lookup' },
    { num: 2, label: 'Verify Identity' },
    { num: 3, label: 'Select Concern' },
    { num: 4, label: 'Resolution' }
  ];

  readonly currentStep = this.state.currentStep;

  constructor(private state: KioskStateService) {}

  getStepState(stepNum: number): 'done' | 'active' | 'pending' {
    const cur = this.currentStep();
    if (stepNum < cur)  return 'done';
    if (stepNum === cur) return 'active';
    return 'pending';
  }

  getLineState(afterStep: number): 'done' | 'pending' {
    return afterStep < this.currentStep() ? 'done' : 'pending';
  }
}
