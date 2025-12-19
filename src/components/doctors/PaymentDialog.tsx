import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { 
  CreditCard, 
  Shield, 
  Lock, 
  Check, 
  AlertCircle,
  Smartphone,
  University,
  Wallet
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  icon: React.ReactNode;
  description: string;
}

interface PaymentDialogProps {
  appointmentData: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: (paymentId: string) => void;
}

export function PaymentDialog({
  appointmentData,
  open,
  onOpenChange,
  onPaymentSuccess
}: PaymentDialogProps) {
  const { t } = useApp();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');

  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, MasterCard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      type: 'upi',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      type: 'netbanking',
      icon: <University className="w-5 h-5" />,
      description: 'All major banks supported'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      type: 'wallet',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Paytm, PhonePe, Amazon Pay'
    }
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setPaymentStep('details');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      const paymentId = `PAY-${Date.now()}`;
      setPaymentStep('success');
      setIsProcessing(false);
      
      // Call success callback after a short delay to show success screen
      setTimeout(() => {
        onPaymentSuccess(paymentId);
        onOpenChange(false);
        // Reset form
        setPaymentStep('method');
        setSelectedPaymentMethod('');
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardHolderName('');
        setUpiId('');
        setSelectedBank('');
      }, 2000);
    }, 3000);
  };

  const renderPaymentMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="font-semibold">Select Payment Method</h3>
      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-colors hover:bg-accent ${
              selectedPaymentMethod === method.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handlePaymentMethodSelect(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-primary">{method.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-muted-foreground">{method.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCardPaymentForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPaymentStep('method')}
        >
          ← Back to Payment Methods
        </Button>
      </div>
      
      <h3 className="font-semibold">Card Details</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength={19}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cardHolderName">Card Holder Name</Label>
          <Input
            id="cardHolderName"
            placeholder="Full name as on card"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderUPIPaymentForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPaymentStep('method')}
        >
          ← Back to Payment Methods
        </Button>
      </div>
      
      <h3 className="font-semibold">UPI Payment</h3>
      <div>
        <Label htmlFor="upiId">UPI ID</Label>
        <Input
          id="upiId"
          placeholder="yourname@paytm"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
      </div>
    </div>
  );

  const renderNetBankingForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPaymentStep('method')}
        >
          ← Back to Payment Methods
        </Button>
      </div>
      
      <h3 className="font-semibold">Net Banking</h3>
      <div>
        <Label htmlFor="bank">Select Bank</Label>
        <Select value={selectedBank} onValueChange={setSelectedBank}>
          <SelectTrigger>
            <SelectValue placeholder="Choose your bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sbi">State Bank of India</SelectItem>
            <SelectItem value="hdfc">HDFC Bank</SelectItem>
            <SelectItem value="icici">ICICI Bank</SelectItem>
            <SelectItem value="axis">Axis Bank</SelectItem>
            <SelectItem value="pnb">Punjab National Bank</SelectItem>
            <SelectItem value="bob">Bank of Baroda</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPaymentDetails = () => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    
    switch (selectedPaymentMethod) {
      case 'card':
        return renderCardPaymentForm();
      case 'upi':
        return renderUPIPaymentForm();
      case 'netbanking':
        return renderNetBankingForm();
      case 'wallet':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPaymentStep('method')}
              >
                ← Back to Payment Methods
              </Button>
            </div>
            <h3 className="font-semibold">Digital Wallet</h3>
            <p className="text-muted-foreground">
              You will be redirected to your wallet app to complete the payment.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
      <h3 className="font-semibold mb-2">Processing Payment...</h3>
      <p className="text-muted-foreground">Please wait while we process your payment securely.</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-semibold mb-2">Payment Successful!</h3>
      <p className="text-muted-foreground">Your appointment has been booked successfully.</p>
    </div>
  );

  if (!appointmentData) return null;

  const canProceed = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return cardNumber && expiryDate && cvv && cardHolderName;
      case 'upi':
        return upiId;
      case 'netbanking':
        return selectedBank;
      case 'wallet':
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Payment</DialogTitle>
          <DialogDescription>
            Complete your payment to confirm the appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span className="font-medium">{appointmentData.doctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="font-medium">
                  {new Date(appointmentData.date).toLocaleDateString()} at {appointmentData.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <Badge variant="outline">
                  {appointmentData.consultationType === 'online' ? t.onlineConsultation : t.inPersonVisit}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>₹{appointmentData.fee}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Content */}
          {paymentStep === 'method' && renderPaymentMethodSelection()}
          {paymentStep === 'details' && renderPaymentDetails()}
          {paymentStep === 'processing' && renderProcessing()}
          {paymentStep === 'success' && renderSuccess()}

          {/* Security Notice */}
          {paymentStep !== 'processing' && paymentStep !== 'success' && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Your payment information is encrypted and secure. We use industry-standard security measures.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {paymentStep !== 'processing' && paymentStep !== 'success' && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              {paymentStep === 'details' && (
                <Button
                  onClick={handlePayment}
                  disabled={!canProceed() || isProcessing}
                  className="flex-1"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Pay ₹{appointmentData.fee}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}