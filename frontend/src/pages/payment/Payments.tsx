import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  ExternalLink,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import type { EscrowPayment, TransactionStatus } from '../../types';

// Mock payment data - replace with actual API call
const mockPayments: EscrowPayment[] = [
  {
    ID: 1,
    escrow_id: 1,
    buyer_id: 1,
    transaction_ref: 'TXN_001',
    amount: 1500.00,
    currency: 'ETB',
    status: 'Completed',
    payment_url: 'https://payment.example.com/txn001',
    CreatedAt: '2024-01-15T10:30:00Z',
  },
  {
    ID: 2,
    escrow_id: 2,
    buyer_id: 1,
    transaction_ref: 'TXN_002',
    amount: 750.50,
    currency: 'ETB',
    status: 'Pending',
    payment_url: 'https://payment.example.com/txn002',
    CreatedAt: '2024-01-14T14:20:00Z',
  },
  {
    ID: 3,
    escrow_id: 3,
    buyer_id: 1,
    transaction_ref: 'TXN_003',
    amount: 2200.00,
    currency: 'USD',
    status: 'Failed',
    CreatedAt: '2024-01-13T09:15:00Z',
  },
  {
    ID: 4,
    escrow_id: 4,
    buyer_id: 1,
    transaction_ref: 'TXN_004',
    amount: 950.75,
    currency: 'ETB',
    status: 'Refunded',
    CreatedAt: '2024-01-12T16:45:00Z',
  },
];

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isLoading] = useState(false);

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    let filtered = mockPayments.filter(payment => {
      const matchesSearch = payment.transaction_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.escrow_id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      // Date filtering
      let matchesDate = true;
      if (dateRange !== 'all') {
        const paymentDate = new Date(payment.CreatedAt || '');
        const now = new Date();
        const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        matchesDate = paymentDate >= cutoffDate;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.CreatedAt || '').getTime() - new Date(a.CreatedAt || '').getTime());

    return filtered;
  }, [mockPayments, searchTerm, statusFilter, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockPayments.length;
    const completed = mockPayments.filter(p => p.status === 'Completed').length;
    const pending = mockPayments.filter(p => p.status === 'Pending').length;
    const failed = mockPayments.filter(p => p.status === 'Failed').length;
    const totalAmount = mockPayments
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = mockPayments
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

    return { total, completed, pending, failed, totalAmount, pendingAmount };
  }, [mockPayments]);

  const getStatusVariant = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'danger';
      case 'Refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed':
        return CheckCircle;
      case 'Pending':
        return Clock;
      case 'Failed':
        return XCircle;
      case 'Refunded':
        return RefreshCw;
      default:
        return AlertCircle;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading payments..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Payment History
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track and manage all your payment transactions
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <Button variant="outline" className="group">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button className="group">
                  <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  Refresh
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      All time
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stats.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stats.completed} transactions
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stats.pendingAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {stats.pending} transactions
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Failed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.failed}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Needs attention
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by transaction ID or escrow ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<Search />}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
                      className="input-field min-w-[120px]"
                    >
                      <option value="all">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>

                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
                      className="input-field min-w-[120px]"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="all">All time</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payments Table */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Transactions</span>
                  <span className="text-sm font-normal text-gray-500">
                    {filteredPayments.length} transactions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredPayments.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No payments found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters.'
                        : 'Your payment history will appear here once you make transactions.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Transaction
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Escrow
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredPayments.map((payment) => {
                          const StatusIcon = getStatusIcon(payment.status);
                          
                          return (
                            <motion.tr
                              key={payment.ID}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                                    <StatusIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {payment.transaction_ref}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      ID: {payment.ID}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link 
                                  to={`/escrows/${payment.escrow_id}`}
                                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                >
                                  Escrow #{payment.escrow_id}
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {payment.amount.toFixed(2)} {payment.currency}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={getStatusVariant(payment.status) as any}>
                                  {payment.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {payment.CreatedAt 
                                  ? new Date(payment.CreatedAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'N/A'
                                }
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  {payment.payment_url && (
                                    <a
                                      href={payment.payment_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                  <Link to={`/escrows/${payment.escrow_id}`}>
                                    <Button variant="ghost" size="sm" className="group">
                                      View
                                      <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Payments;