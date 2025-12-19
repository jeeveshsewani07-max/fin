import React, { useState } from 'react';
import { Receipt, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { AddPaymentMethodDialog } from '../bills/AddPaymentMethodDialog';
import { PaymentHistoryDialog } from '../bills/PaymentHistoryDialog';
import { toast } from 'sonner@2.0.3';

export function BillsPage() {
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      title: '**** **** **** 1234',
      subtitle: 'John Doe',
      details: { cardNumber: '1234567812341234', expiryDate: '12/25', cardholderName: 'John Doe' }
    },
    {
      id: '2',
      type: 'upi',
      title: 'UPI',
      subtitle: 'john@paytm',
      details: { upiId: 'john@paytm' }
    }
  ]);

  const bills = {
    'house-tax': {
      title: 'Property Tax',
      amount: 15750,
      dueDate: '15 Dec 2025',
      status: 'pending',
      bills: [
        { period: 'Q4 2025', amount: 15750, due: '15 Dec 2025', status: 'pending' },
        { period: 'Q3 2025', amount: 15750, due: '15 Sep 2025', status: 'paid', paidDate: '12 Sep 2025' }
      ]
    },
    'water': {
      title: 'Water Bill',
      amount: 420,
      dueDate: '8 Dec 2025',
      status: 'pending',
      bills: [
        { period: 'Nov 2025', amount: 420, due: '8 Dec 2025', status: 'pending' },
        { period: 'Oct 2025', amount: 385, due: '8 Nov 2025', status: 'paid', paidDate: '5 Nov 2025' }
      ]
    },
    'electricity': {
      title: 'Electricity Bill',
      amount: 1250,
      dueDate: '12 Dec 2025',
      status: 'pending',
      bills: [
        { period: 'Nov 2025', amount: 1250, due: '12 Dec 2025', status: 'pending' },
        { period: 'Oct 2025', amount: 1100, due: '12 Nov 2025', status: 'paid', paidDate: '10 Nov 2025' }
      ]
    },
    'others': {
      title: 'Other Bills',
      amount: 0,
      dueDate: '',
      status: 'none',
      bills: [
        { period: 'Internet - Nov 2025', amount: 899, due: '5 Dec 2025', status: 'paid', paidDate: '3 Dec 2025' },
        { period: 'Gas - Nov 2025', amount: 650, due: '10 Dec 2025', status: 'paid', paidDate: '8 Dec 2025' }
      ]
    }
  };

  const handlePayBill = (billType: string, amount: number) => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(`Payment of ₹${amount.toLocaleString()} for ${bills[billType as keyof typeof bills].title} successful!`);
      setTimeout(() => setPaymentSuccess(null), 3000);
    }, 1500);
  };

  const handlePaymentMethodAdded = (newMethod: any) => {
    setPaymentMethods(prev => [...prev, newMethod]);
    toast.success('Payment method added successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive" className="flex items-center gap-1"><Clock size={12} />Pending</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-green-600 flex items-center gap-1"><CheckCircle size={12} />Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle size={12} />Overdue</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Bills & Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPaymentHistory(true)}>
            <Receipt size={20} className="mr-2" />
            Payment History
          </Button>
          <Button onClick={() => setShowAddPaymentMethod(true)}>
            <CreditCard size={20} className="mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {paymentSuccess && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <p className="font-medium">{paymentSuccess}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="house-tax" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="house-tax">Property Tax</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
          <TabsTrigger value="electricity">Electricity</TabsTrigger>
          <TabsTrigger value="others">Others</TabsTrigger>
        </TabsList>

        {Object.entries(bills).map(([key, bill]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt size={24} />
                    {bill.title}
                  </CardTitle>
                  {bill.status === 'pending' && (
                    <Button 
                      size="lg"
                      onClick={() => handlePayBill(key, bill.amount)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard size={20} className="mr-2" />
                      Pay ₹{bill.amount.toLocaleString()} Now
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {bill.status === 'pending' && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Clock size={20} />
                      <div>
                        <p className="font-medium">Payment Due</p>
                        <p className="text-sm">Amount: ₹{bill.amount.toLocaleString()} • Due: {bill.dueDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold">Bill History</h3>
                  <div className="space-y-3">
                    {bill.bills.map((billItem, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                        <div>
                          <p className="font-medium">{billItem.period}</p>
                          <p className="text-sm text-muted-foreground">
                            Amount: ₹{billItem.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {billItem.status === 'paid' 
                              ? `Paid on: ${billItem.paidDate}` 
                              : `Due: ${billItem.due}`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(billItem.status)}
                          {billItem.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="mt-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handlePayBill(key, billItem.amount)}
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-destructive">₹17,420</p>
              <p className="text-sm text-muted-foreground">Total Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">₹18,484</p>
              <p className="text-sm text-muted-foreground">Paid This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold">3</p>
              <p className="text-sm text-muted-foreground">Bills Due Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddPaymentMethodDialog
        open={showAddPaymentMethod}
        onOpenChange={setShowAddPaymentMethod}
        onPaymentMethodAdded={handlePaymentMethodAdded}
      />
      <PaymentHistoryDialog
        open={showPaymentHistory}
        onOpenChange={setShowPaymentHistory}
      />
    </div>
  );
}