import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { useEscrows } from '../../hooks/useEscrows';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import type { EscrowStatus } from '../../types';

const Escrows: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EscrowStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  
  const { escrows, isLoadingEscrows, escrowsError } = useEscrows();
  const { user } = useAuth();

  // Filter and sort escrows
  const filteredEscrows = useMemo(() => {
    let filtered = escrows.filter(escrow => {
      const matchesSearch = escrow.conditions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           escrow.ID?.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || escrow.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort escrows
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.CreatedAt || '').getTime() - new Date(a.CreatedAt || '').getTime();
      }
    });

    return filtered;
  }, [escrows, searchTerm, statusFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = escrows.length;
    const pending = escrows.filter(e => e.status === 'Pending').length;
    const funded = escrows.filter(e => e.status === 'Funded').length;
    const completed = escrows.filter(e => e.status === 'Released').length;
    const totalValue = escrows.reduce((sum, e) => sum + e.amount, 0);

    return { total, pending, funded, completed, totalValue };
  }, [escrows]);

  const getStatusVariant = (status: EscrowStatus) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Funded':
        return 'info';
      case 'Released':
        return 'success';
      case 'Disputed':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: EscrowStatus) => {
    switch (status) {
      case 'Pending':
        return Clock;
      case 'Funded':
        return Shield;
      case 'Released':
        return CheckCircle;
      case 'Disputed':
        return AlertCircle;
      default:
        return Shield;
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

  if (isLoadingEscrows) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading escrows..." />
      </div>
    );
  }

  if (escrowsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Escrows
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't load your escrows. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
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
                  My Escrows
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and track your secure transactions
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link to="/escrows/create">
                  <Button className="group">
                    <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    Create Escrow
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Escrows
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.pending}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Funded
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.funded}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.completed}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stats.totalValue.toFixed(0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Search */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="flex-1">
                      <Input
                        placeholder="Search escrows..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search />}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as EscrowStatus | 'all')}
                        className="input-field min-w-[120px]"
                      >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Funded">Funded</option>
                        <option value="Released">Released</option>
                        <option value="Disputed">Disputed</option>
                      </select>

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'status')}
                        className="input-field min-w-[120px]"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Amount</option>
                        <option value="status">Sort by Status</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Escrows Grid */}
          {filteredEscrows.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="p-12 text-center">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No escrows found' : 'No escrows yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Create your first escrow to start securing your transactions with SafeDeal.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Link to="/escrows/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Escrow
                    </Button>
                  </Link>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEscrows.map((escrow) => {
                const StatusIcon = getStatusIcon(escrow.status);
                
                return (
                  <motion.div
                    key={escrow.ID}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                              <StatusIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                Escrow #{escrow.ID}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {escrow.CreatedAt ? new Date(escrow.CreatedAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(escrow.status) as any}>
                            {escrow.status}
                          </Badge>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${escrow.amount.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Buyer ID</span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              #{escrow.buyer_id}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Seller ID</span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              #{escrow.seller_id}
                            </span>
                          </div>
                        </div>

                        {escrow.conditions && (
                          <div className="mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {escrow.conditions}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Link to={`/escrows/${escrow.ID}`}>
                            <Button variant="outline" size="sm" className="group">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                              <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Button>
                          </Link>
                          
                          {escrow.status === 'Funded' && escrow.buyer_id === user?.id && (
                            <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                              Release Funds
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Escrows;