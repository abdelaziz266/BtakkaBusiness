import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface ApiResponse {
  status: number;
  message: string;
  data: any;
  errors: any;
  errorCode: any;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  constructor(private toastr: ToastrService) { }

  handleResponse(response: ApiResponse): void {
    if (response.status >= 200 && response.status < 300) {
      // Success responses (2xx)
      this.toastr.success(response.message || 'Operation completed successfully!', 'Success');
    } else if (response.status >= 400 && response.status < 500) {
      // Client errors (4xx)
      this.toastr.error(response.message || 'Bad request', 'Error');
    } else if (response.status >= 500) {
      // Server errors (5xx)
      this.toastr.error(response.message || 'Server error occurred', 'Server Error');
    } else {
      // Other status codes
      this.toastr.warning(response.message || 'Something went wrong', 'Warning');
    }
  }

  handleError(error: any): void {
    if (error.error && error.error.message) {
      // If error contains response with message
      this.handleResponse(error.error);
    } else if (error.status) {
      // If only status code is available
      const message = error.message || error.statusText || 'An error occurred';
      this.handleResponse({
        status: error.status,
        message: message,
        data: null,
        errors: null,
        errorCode: null
      });
    } else {
      // Unknown error
      this.toastr.error('An unexpected error occurred', 'Error');
    }
  }
}

