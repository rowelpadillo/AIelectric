import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KioskStateService } from '../../services/kiosk-state.service';
import { StepIndicatorComponent } from '../../components/step-indicator/step-indicator.component';
import { AccountLookupComponent } from '../../components/account-lookup/account-lookup.component';
import { CustomerVerifyComponent } from '../../components/customer-verify/customer-verify.component';
import { ConcernSelectComponent } from '../../components/concern-select/concern-select.component';
import { ResolutionComponent } from '../../components/resolution/resolution.component';
import { PipelineVizComponent } from '../../components/pipeline-viz/pipeline-viz.component';

@Component({
  selector: 'app-kiosk',
  standalone: true,
  imports: [
    CommonModule,
    StepIndicatorComponent,
    AccountLookupComponent,
    CustomerVerifyComponent,
    ConcernSelectComponent,
    ResolutionComponent,
    PipelineVizComponent
  ],
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.css']
})
export class KioskComponent {
  readonly currentStep = this.state.currentStep;

  constructor(private state: KioskStateService) {}
}
