import { Injectable, signal, computed } from '@angular/core';
import { CustomerAccount, KioskStep, LogEntry, PipelineNode } from '../models/kiosk.models';

@Injectable({ providedIn: 'root' })
export class KioskStateService {

  /* ── Step ───────────────────────────────────────────────── */
  readonly currentStep = signal<KioskStep>(1);

  /* ── Customer ───────────────────────────────────────────── */
  readonly currentAccount = signal<CustomerAccount | null>(null);

  /* ── Concern ────────────────────────────────────────────── */
  readonly selectedConcern = signal<string | null>(null);

  /* ── Pipeline ───────────────────────────────────────────── */
  readonly pipelineActive = signal<boolean>(false);

  readonly pipelineNodes = signal<PipelineNode[]>([
    { id: 0, icon: '🖥️', name: 'Kiosk Terminal',     desc: 'Request initiated from terminal',          state: 'idle' },
    { id: 1, icon: '🔐', name: 'Auth Gateway',        desc: 'Validating session token & permissions',   state: 'idle' },
    { id: 2, icon: '🔀', name: 'Load Balancer',       desc: 'Routing to available service node',        state: 'idle' },
    { id: 3, icon: '⚙️', name: 'Account Service API', desc: 'Querying customer records',                state: 'idle' },
    { id: 4, icon: '🗄️', name: 'Main Database',       desc: 'SELECT from accounts, billing, meters',   state: 'idle' },
    { id: 5, icon: '📦', name: 'Data Serializer',     desc: 'Packaging response payload',               state: 'idle' },
    { id: 6, icon: '✅', name: 'Response Delivered',  desc: 'Data returned to kiosk display',           state: 'idle' }
  ]);

  readonly logEntries = signal<LogEntry[]>([]);
  readonly meterPercent = signal<number>(0);

  /* ── Computed ───────────────────────────────────────────── */
  readonly meterDisplay = computed(() => {
    const pct = this.meterPercent();
    return pct === 0 ? '0 KB/s' : `${Math.round(pct * 0.86)} KB/s`;
  });

  /* ── Mutations ──────────────────────────────────────────── */
  setStep(step: KioskStep): void {
    this.currentStep.set(step);
  }

  setAccount(account: CustomerAccount | null): void {
    this.currentAccount.set(account);
  }

  setConcern(concern: string | null): void {
    this.selectedConcern.set(concern);
  }

  addLog(type: LogEntry['type'], text: string): void {
    const now = new Date();
    const ms  = String(now.getMilliseconds()).padStart(3, '0');
    const ts  = now.toTimeString().slice(0, 8) + '.' + ms;
    this.logEntries.update(entries => [...entries, { timestamp: ts, type, text }]);
  }

  clearLog(): void {
    this.logEntries.set([]);
  }

  resetPipelineNodes(): void {
    this.pipelineNodes.update(nodes =>
      nodes.map(n => ({
        ...n,
        state: 'idle' as const,
        icon: ['🖥️','🔐','🔀','⚙️','🗄️','📦','✅'][n.id]
      }))
    );
    this.meterPercent.set(0);
  }

  activatePipelineNode(index: number): void {
    this.pipelineNodes.update(nodes =>
      nodes.map((n, i) => {
        if (i === index)     return { ...n, state: 'active' as const };
        if (i === index - 1) return { ...n, state: 'done' as const, icon: '✓' };
        return n;
      })
    );
    this.meterPercent.set(Math.round((index + 1) / 7 * 100));
  }

  completePipeline(): void {
    this.pipelineNodes.update(nodes =>
      nodes.map(n => ({ ...n, state: 'done' as const, icon: '✓' }))
    );
    this.meterPercent.set(100);
  }

  /** Animate the pipeline with sequential node activation */
  runPipeline(logMessages: Array<{ type: LogEntry['type']; text: string }>, speeds: number[]): Promise<void> {
    this.pipelineActive.set(true);
    this.resetPipelineNodes();
    this.clearLog();

    return new Promise(resolve => {
      let delay = 0;
      for (let i = 0; i < 7; i++) {
        const idx = i;
        setTimeout(() => {
          this.activatePipelineNode(idx);
          if (logMessages[idx]) {
            this.addLog(logMessages[idx].type, logMessages[idx].text);
          }
        }, delay);
        delay += speeds[i] ?? 600;
      }
      setTimeout(() => {
        this.completePipeline();
        this.pipelineActive.set(false);
        resolve();
      }, delay + 200);
    });
  }

  reset(): void {
    this.currentStep.set(1);
    this.currentAccount.set(null);
    this.selectedConcern.set(null);
    this.pipelineActive.set(false);
    this.resetPipelineNodes();
    this.clearLog();
  }
}
