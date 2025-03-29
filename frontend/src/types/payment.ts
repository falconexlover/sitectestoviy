export interface PaymentMethod {
  id: string;
  title: string;
  icon: string;
  description?: string;
}

export interface FormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

export interface FormErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  submit?: string;
} 