import React, { useState } from 'react';
import { CreditCard, Building2, Smartphone, Wallet, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { useApp } from '../../contexts/AppContext';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentMethodAdded: (method: any) => void;
}

export function AddPaymentMethodDialog({ open, onOpenChange, onPaymentMethodAdded }: AddPaymentMethodDialogProps) {
  const { t } = useApp();
  const [selectedType, setSelectedType] = useState<string>('card');
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    // Bank details
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: '',
    // UPI details
    upiId: '',
    // Wallet details
    walletProvider: '',
    walletNumber: ''
  });

  const paymentTypes = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'bank', label: 'Bank Account', icon: Building2 },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'wallet', label: 'Digital Wallet', icon: Wallet }
  ];

  const walletProviders = [
    'Paytm',
    'PhonePe',
    'Google Pay',
    'Amazon Pay',
    'Mobikwik',
    'Freecharge'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let paymentMethod;
    switch (selectedType) {
      case 'card':
        paymentMethod = {
          id: Date.now().toString(),
          type: 'card',
          title: `**** **** **** ${formData.cardNumber.slice(-4)}`,
          subtitle: formData.cardholderName,
          details: {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cardholderName: formData.cardholderName
          }
        };
        break;
      case 'bank':
        paymentMethod = {
          id: Date.now().toString(),
          type: 'bank',
          title: `${formData.bankName}`,
          subtitle: `****${formData.accountNumber.slice(-4)}`,
          details: {
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            accountHolderName: formData.accountHolderName,
            bankName: formData.bankName
          }
        };
        break;
      case 'upi':
        paymentMethod = {
          id: Date.now().toString(),
          type: 'upi',
          title: 'UPI',
          subtitle: formData.upiId,
          details: {
            upiId: formData.upiId
          }
        };
        break;
      case 'wallet':
        paymentMethod = {
          id: Date.now().toString(),
          type: 'wallet',
          title: formData.walletProvider,
          subtitle: formData.walletNumber,
          details: {
            walletProvider: formData.walletProvider,
            walletNumber: formData.walletNumber
          }
        };
        break;
    }

    onPaymentMethodAdded(paymentMethod);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: '',
      upiId: '',
      walletProvider: '',
      walletNumber: ''
    });
    setSelectedType('card');
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="Enter cardholder name"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              />
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                placeholder="Enter IFSC code"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                id="accountHolderName"
                placeholder="Enter account holder name"
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
              />
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="username@paytm"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              />
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="walletProvider">Wallet Provider</Label>
              <Select
                value={formData.walletProvider}
                onValueChange={(value) => setFormData({ ...formData, walletProvider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet provider" />
                </SelectTrigger>
                <SelectContent>
                  {walletProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="walletNumber">Phone Number</Label>
              <Input
                id="walletNumber"
                placeholder="Enter phone number"
                value={formData.walletNumber}
                onChange={(e) => setFormData({ ...formData, walletNumber: e.target.value })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={24} />
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Add a new payment method to your account for easy bill payments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Type Selection */}
          <div className="space-y-3">
            <Label>Select Payment Method Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-colors ${
                      selectedType === type.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <Icon size={24} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">{type.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Payment Method Form */}
          {renderForm()}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Payment Method
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}