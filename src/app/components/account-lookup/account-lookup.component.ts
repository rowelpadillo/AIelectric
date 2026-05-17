import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ConcernService } from '../../services/concern.service';
import { KioskStateService } from '../../services/kiosk-state.service';

@Component({
  selector: 'app-account-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-lookup.component.html',
  styleUrls: ['./account-lookup.component.css']
})
export class AccountLookupComponent {
  accountNumber = '';
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private accountService: AccountService,
    private concernService: ConcernService,
    private state: KioskStateService
  ) {}

  lookup(): void {
    this.errorMessage.set('');

    if (this.accountNumber.trim().length < 6) {
      this.errorMessage.set('Please enter a valid account number (6–8 digits).');
      return;
    }

    this.isLoading.set(true);

    // Run pipeline animation while waiting for API
    this.state.runPipeline(
      [
        { type: 'info',    text: `GET /api/accounts/${this.accountNumber}` },
        { type: 'info',    text: '[AUTH] Validating session... OK' },
        { type: 'info',    text: '[LB] Routing to node-svc-03' },
        { type: 'info',    text: `[API] AccountService.findById("${this.accountNumber}")` },
        { type: 'data',    text: `[DB] SELECT * FROM accounts WHERE id="${this.accountNumber}"` },
        { type: 'data',    text: '[DB] Rows returned: 1' },
        { type: 'success', text: '[RESP] 200 OK — payload: 248 bytes' }
      ],
      [0, 500, 600, 700, 900, 500, 400]
    );

    this.accountService.getAccount(this.accountNumber.trim()).subscribe({
      next: (account) => {
        this.isLoading.set(false);
        this.state.setAccount(account);
        this.state.setStep(2);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Account not found. Try: 12345678, 87654321, or 11223344.');
        this.state.addLog('warn', '[RESP] 404 — Account not found');
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.lookup();
  }
}
