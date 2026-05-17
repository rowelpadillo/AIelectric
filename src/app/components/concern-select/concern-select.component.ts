import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcernService } from '../../services/concern.service';
import { KioskStateService } from '../../services/kiosk-state.service';
import { Concern } from '../../models/kiosk.models';

@Component({
  selector: 'app-concern-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concern-select.component.html',
  styleUrls: ['./concern-select.component.css']
})
export class ConcernSelectComponent {
  readonly concerns: Concern[] = this.concernService.getConcerns();
  readonly selectedKey = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly loadingText = signal('');

  constructor(
    private concernService: ConcernService,
    private state: KioskStateService
  ) {}

  select(concern: Concern): void {
    if (this.isLoading()) return;

    this.selectedKey.set(concern.key);
    this.isLoading.set(true);
    this.loadingText.set(`Fetching data for: ${concern.label}...`);

    const accountNumber = this.state.currentAccount()?.account ?? '';

    // Run pipeline animation
    this.state.runPipeline(
      [
        { type: 'info',    text: `POST /api/concerns — concern="${concern.key}"` },
        { type: 'info',    text: '[AUTH] Role check: CUSTOMER_KIOSK OK' },
        { type: 'info',    text: '[LB] Forwarding to concern-svc-01' },
        { type: 'info',    text: `[API] ConcernService.resolve("${concern.key}", "${accountNumber}")` },
        { type: 'data',    text: '[DB] SELECT concern_data, history FROM concerns WHERE...' },
        { type: 'data',    text: '[DB] Joined tables: concerns, accounts, outages, billing' },
        { type: 'success', text: '[RESP] 200 OK — resolution payload ready' }
      ],
      [0, 400, 500, 700, 900, 600, 400]
    );

    this.concernService.resolveConcern(concern.key, accountNumber).subscribe(response => {
      this.isLoading.set(false);
      this.state.setConcern(concern.key);
      // Store response in state for the resolution component
      (this.state as any)._lastConcernResponse = response;
      (this.state as any)._lastConcernLabel = concern.label;
      this.state.addLog('success', `[DONE] Concern resolved — status: ${response.status}`);
      this.state.setStep(4);
    });
  }
}
