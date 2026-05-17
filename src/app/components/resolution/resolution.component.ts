import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KioskStateService } from '../../services/kiosk-state.service';

@Component({
  selector: 'app-resolution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resolution.component.html',
  styleUrls: ['./resolution.component.css']
})
export class ResolutionComponent {
  readonly ticketRef = `TKT-${Date.now().toString().slice(-8)}`;

  get response() {
    return (this.state as any)._lastConcernResponse ?? { status: 'Logged', body: '' };
  }

  get concernLabel(): string {
    return (this.state as any)._lastConcernLabel ?? '';
  }

  constructor(private state: KioskStateService) {}

  newConcern(): void {
    this.state.resetPipelineNodes();
    this.state.clearLog();
    this.state.setStep(3);
  }

  returnHome(): void {
    this.state.reset();
  }
}
