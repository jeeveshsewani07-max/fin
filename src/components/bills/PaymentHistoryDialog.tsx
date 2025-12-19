import React, { useState } from 'react';
import { Receipt, CheckCircle, CreditCard, Building2, Smartphone, Wallet, Calendar, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useApp } from '../../contexts/AppContext';

interface PaymentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentHistoryDialog({ open, onOpenChange }: PaymentHistoryDialogProps) {
  const { t } = useApp();
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock payment history data
  const paymentHistory = [
    {
      id: '1',
      date: '2025-12-03',
      billType: 'Internet',
      amount: 899,
      status: 'success',
      paymentMethod: { type: 'upi', name: 'Google Pay' },
      transactionId: 'TXN001234567890'
    },
    {
      id: '2',
      date: '2025-12-08',
      billType: 'Gas Bill',
      amount: 650,
      status: 'success',
      paymentMethod: { type: 'card', name: '**** 1234' },
      transactionId: 'TXN001234567891'
    },
    {
      id: '3',
      date: '2025-11-10',
      billType: 'Electricity Bill',
      amount: 1100,
      status: 'success',
      paymentMethod: { type: 'bank', name: 'HDFC Bank' },
      transactionId: 'TXN001234567892'
    },
    {
      id: '4',
      date: '2025-11-05',
      billType: 'Water Bill',
      amount: 385,
      status: 'success',
      paymentMethod: { type: 'wallet', name: 'Paytm' },
      transactionId: 'TXN001234567893'
    },
    {
      id: '5',
      date: '2025-10-15',
      billType: 'Property Tax',
      amount: 15750,
      status: 'success',
      paymentMethod: { type: 'card', name: '**** 5678' },
      transactionId: 'TXN001234567894'
    },
    {
      id: '6',
      date: '2025-10-12',
      billType: 'Electricity Bill',
      amount: 1250,
      status: 'failed',
      paymentMethod: { type: 'upi', name: 'PhonePe' },
      transactionId: 'TXN001234567895'
    }
  ];

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard size={16} />;
      case 'bank':
        return <Building2 size={16} />;
      case 'upi':
        return <Smartphone size={16} />;
      case 'wallet':
        return <Wallet size={16} />;
      default:
        return <CreditCard size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-600 flex items-center gap-1">
            <CheckCircle size={12} />
            Success
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredHistory = paymentHistory.filter(payment => {
    const matchesPeriod = filterPeriod === 'all' || 
      (filterPeriod === 'thisMonth' && new Date(payment.date).getMonth() === new Date().getMonth()) ||
      (filterPeriod === 'lastMonth' && new Date(payment.date).getMonth() === new Date().getMonth() - 1) ||
      (filterPeriod === 'last3Months' && 
        new Date(payment.date) >= new Date(new Date().setMonth(new Date().getMonth() - 3)));
    
    const matchesType = filterType === 'all' || payment.paymentMethod.type === filterType;
    
    return matchesPeriod && matchesType;
  });

  const totalAmount = filteredHistory
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt size={24} />
            Payment History
          </DialogTitle>
          <DialogDescription>
            View your complete payment history with filtering options.
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-4 pb-4 border-b">
          <div className="flex-1">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger>
                <Calendar size={16} className="mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Digital Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 pb-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-lg font-semibold text-green-600">₹{totalAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-lg font-semibold">{filteredHistory.filter(p => p.status === 'success').length}</p>
              <p className="text-sm text-muted-foreground">Successful</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-lg font-semibold text-red-600">{filteredHistory.filter(p => p.status === 'failed').length}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment History List */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-3">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Receipt size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.billType}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getPaymentMethodIcon(payment.paymentMethod.type)}
                              <span className="text-sm text-muted-foreground">
                                {payment.paymentMethod.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{payment.amount.toLocaleString()}</p>
                        <div className="mb-2">{getStatusBadge(payment.status)}</div>
                        <p className="text-xs text-muted-foreground">ID: {payment.transactionId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Receipt size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No payment history found for selected filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}