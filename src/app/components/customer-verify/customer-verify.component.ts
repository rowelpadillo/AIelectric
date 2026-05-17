import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KioskStateService } from '../../services/kiosk-state.service';

@Component({
  selector: 'app-customer-verify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-verify.component.html',
  styleUrls: ['./customer-verify.component.css']
})
export class CustomerVerifyComponent {
  readonly account = this.state.currentAccount;

  constructor(private state: KioskStateService) {}

  confirm(): void {
    this.state.addLog('success', '[AUTH] Identity confirmed by customer');
    this.state.addLog('info',    '[SESSION] Concern selection mode active');
    this.state.resetPipelineNodes();
    this.state.setStep(3);
  }

  reject(): void {
    this.state.reset();
  }

  get statusColor(): string {
    return this.account()?.status === 'Active' ? 'var(--green)' : 'var(--red)';
  }
}
