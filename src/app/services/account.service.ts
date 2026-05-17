import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CustomerAccount } from '../models/kiosk.models';

const DUMMY_ACCOUNTS: Record<string, CustomerAccount> = {
  '12345678': {
    account: '12345678',
    name: 'Maria Santos',
    address: 'Lot 5 Blk 3, Banawa Hills, Cebu City',
    meter: 'MTR-00482-C',
    type: 'Residential (R1)',
    status: 'Active',
    balance: '₱ 3,248.00',
    dueDate: 'June 5, 2026'
  },
  '87654321': {
    account: '87654321',
    name: 'Jose Reyes',
    address: '22 Mabolo St., Brgy. Mabolo, Cebu City',
    meter: 'MTR-00193-A',
    type: 'Commercial (C2)',
    status: 'Active',
    balance: '₱ 18,540.50',
    dueDate: 'May 28, 2026'
  },
  '11223344': {
    account: '11223344',
    name: 'Lourdes Tan',
    address: 'Brgy. Lahug, Cebu City',
    meter: 'MTR-00851-B',
    type: 'Residential (R2)',
    status: 'Disconnected',
    balance: '₱ 7,120.00',
    dueDate: 'Overdue'
  }
};

@Injectable({ providedIn: 'root' })
export class AccountService {

  /**
   * Look up a customer account by account number.
   * Replace the body of this method with a real HttpClient.get() call
   * when the backend API is ready:
   *
   *   return this.http.get<CustomerAccount>(`/api/accounts/${accountNumber}`);
   */
  getAccount(accountNumber: string): Observable<CustomerAccount> {
    const account = DUMMY_ACCOUNTS[accountNumber];
    if (account) {
      return of(account).pipe(delay(3800));
    }
    return throwError(() => new Error('Account not found')).pipe(delay(3800)) as Observable<CustomerAccount>;
  }
}
