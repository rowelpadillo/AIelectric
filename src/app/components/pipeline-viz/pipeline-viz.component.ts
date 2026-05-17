import { Component, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KioskStateService } from '../../services/kiosk-state.service';

@Component({
  selector: 'app-pipeline-viz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pipeline-viz.component.html',
  styleUrls: ['./pipeline-viz.component.css']
})
export class PipelineVizComponent {
  @ViewChild('logConsole') logConsoleRef!: ElementRef<HTMLDivElement>;

  readonly nodes        = this.state.pipelineNodes;
  readonly logEntries   = this.state.logEntries;
  readonly pipeActive   = this.state.pipelineActive;
  readonly meterPercent = this.state.meterPercent;
  readonly meterDisplay = this.state.meterDisplay;

  get showIdle(): boolean {
    return !this.pipeActive() && this.nodes().every(n => n.state === 'idle');
  }

  constructor(private state: KioskStateService) {
    // Auto-scroll log when new entries arrive
    effect(() => {
      this.logEntries(); // subscribe
      setTimeout(() => {
        if (this.logConsoleRef?.nativeElement) {
          this.logConsoleRef.nativeElement.scrollTop =
            this.logConsoleRef.nativeElement.scrollHeight;
        }
      }, 0);
    });
  }

  trackNode(index: number, node: any): number {
    return node.id;
  }
}
