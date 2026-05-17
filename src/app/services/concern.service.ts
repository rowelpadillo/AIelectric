import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ConcernResponse, Concern } from '../models/kiosk.models';

export const CONCERN_LIST: Concern[] = [
  { key: 'Power Interruption',        icon: '⚡', label: 'Power Interruption'     },
  { key: 'High Bill Dispute',         icon: '📋', label: 'High Bill Dispute'      },
  { key: 'Meter Reading Error',       icon: '📟', label: 'Meter Reading Error'    },
  { key: 'Connection Request',        icon: '🔌', label: 'New Connection'         },
  { key: 'Reconnection Request',      icon: '🔄', label: 'Reconnection'           },
  { key: 'Transfer of Account',       icon: '📂', label: 'Transfer of Account'    },
  { key: 'Payment Arrangement',       icon: '💳', label: 'Payment Arrangement'    },
  { key: 'Streetlight Report',        icon: '💡', label: 'Streetlight Report'     },
  { key: 'Service Quality Complaint', icon: '⚠️', label: 'Service Quality'        }
];

const CONCERN_RESPONSES: Record<string, ConcernResponse> = {
  'Power Interruption': {
    status: 'Logged',
    body: `<strong>Power Interruption Report Filed</strong><br><br>
Our systems have detected an active scheduled maintenance in your area (Banawa Hills Zone 4)
from <strong>8:00 AM – 12:00 PM today</strong> due to transmission line upgrading works.<br><br>
Estimated restoration time: <strong>12:00 PM</strong>. If power has not been restored by then,
a field crew will be dispatched within 2 hours. You will receive an SMS notification at your registered mobile number.`
  },
  'High Bill Dispute': {
    status: 'Under Review',
    body: `<strong>Bill Dispute Initiated</strong><br><br>
Your bill dispute has been received and flagged for review by our Billing Department.
A meter re-read has been scheduled for <strong>May 20, 2026</strong>.<br><br>
Comparison data shows an <strong>18% increase</strong> from your previous month.
A detailed breakdown will be sent to your registered email within <strong>3–5 business days</strong>.`
  },
  'Meter Reading Error': {
    status: 'Dispatched',
    body: `<strong>Meter Reading Dispute Submitted</strong><br><br>
A field technician has been assigned to verify your meter.
Scheduled site visit: <strong>May 19, 2026 between 9 AM – 12 PM</strong>.<br><br>
Please ensure someone is present at the premises. If the reading is confirmed erroneous,
a credit adjustment will be applied to your next billing cycle.`
  },
  'Connection Request': {
    status: 'Pending Docs',
    body: `<strong>New Connection Application</strong><br><br>
To proceed, please prepare:<br><br>
• <strong>Proof of ownership / lease agreement</strong><br>
• Valid government-issued ID<br>
• Electrical wiring inspection certificate<br><br>
Visit our main office at VECO Building, Osmeña Blvd., or complete online at
<strong>electraserve.ph/connect</strong>.`
  },
  'Reconnection Request': {
    status: 'Processing',
    body: `<strong>Reconnection Request Received</strong><br><br>
Your account shows an outstanding balance. Upon full payment or approved payment arrangement,
reconnection will be scheduled within <strong>24 hours</strong>.<br><br>
You may pay via GCash, Maya, bank transfer, or at any authorized payment center.
Bring your official receipt to expedite the reconnection process.`
  },
  'Transfer of Account': {
    status: 'Pending Docs',
    body: `<strong>Account Transfer Application</strong><br><br>
Required documents:<br><br>
• Deed of Sale / Title transfer documents<br>
• Valid ID of new account holder<br>
• Clearance of outstanding balance<br><br>
Processing time is approximately <strong>5–7 business days</strong> upon receipt of complete documents.`
  },
  'Payment Arrangement': {
    status: 'Approved',
    body: `<strong>Payment Arrangement Granted</strong><br><br>
A 3-month installment plan has been approved:<br><br>
• <strong>May 31:</strong> First installment<br>
• <strong>June 30:</strong> Second installment<br>
• <strong>July 31:</strong> Final installment<br><br>
A formal arrangement letter will be available for pickup at our office within 24 hours.`
  },
  'Streetlight Report': {
    status: 'Filed',
    body: `<strong>Streetlight Defect Report Logged</strong><br><br>
Your report has been forwarded to the <strong>Public Lighting Maintenance Team</strong>.
A crew will inspect within <strong>48–72 hours</strong>.<br><br>
Ticket for follow-up: <strong>SL-2026-00831</strong>.
Track at electraserve.ph/streetlights or call our hotline at 032-888-1000.`
  },
  'Service Quality Complaint': {
    status: 'Escalated',
    body: `<strong>Service Quality Complaint Escalated</strong><br><br>
Your complaint has been escalated to our <strong>Quality Assurance Department</strong>.
A senior officer will contact you within <strong>2 business days</strong>.<br><br>
For safety hazards (sparking wires, burning smell), call our emergency hotline:
<strong>032-888-9999 (24/7)</strong>.`
  }
};

@Injectable({ providedIn: 'root' })
export class ConcernService {

  getConcerns(): Concern[] {
    return CONCERN_LIST;
  }

  /**
   * Resolve a concern for the given account.
   * Replace with a real HttpClient.post() call when backend is ready:
   *
   *   return this.http.post<ConcernResponse>('/api/concerns', { concern, accountNumber });
   */
  resolveConcern(concern: string, accountNumber: string): Observable<ConcernResponse> {
    console.log(`[ConcernService] Resolving "${concern}" for account ${accountNumber}`);
    const response = CONCERN_RESPONSES[concern] ?? {
      status: 'Logged',
      body: '<strong>Your concern has been received.</strong><br><br>A representative will follow up shortly.'
    };
    return of(response).pipe(delay(4200));
  }
}
