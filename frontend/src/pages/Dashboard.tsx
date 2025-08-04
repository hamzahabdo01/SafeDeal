import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEscrows } from '../hooks/useEscrows';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { escrows, isLoadingEscrows } = useEscrows();

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalEscrows = escrows.length;
    const activeEscrows = escrows.filter(e => e.status === 'Pending' || e.status === 'Funded').length;
    const completedEscrows = escrows.filter(e => e.status === 'Released').length;
    const totalValue = escrows.reduce((sum, e) => sum + e.amount, 0);

    return {
      totalEscrows,
      activeEscrows,
      completedEscrows,
      totalValue,
    };
  }, [escrows]);

  const recentEscrows = escrows.slice(0, 5);

  const getStatusVariant = (status: string) => {
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

  if (isLoadingEscrows) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your escrows today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Escrows
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalEscrows}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Escrows
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeEscrows}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedEscrows}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalValue.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/escrows/create">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Escrow
              </Button>
            </Link>
            <Link to="/escrows">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                View All Escrows
              </Button>
            </Link>
            <Link to="/payments">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                View Payments
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Escrows</CardTitle>
            <Link to="/escrows">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentEscrows.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No escrows yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating your first escrow.
                </p>
                <div className="mt-6">
                  <Link to="/escrows/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Escrow
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEscrows.map((escrow) => (
                  <div
                    key={escrow.ID}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Escrow #{escrow.ID}
                        </p>
                        <Badge variant={getStatusVariant(escrow.status) as any}>
                          {escrow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Amount: ${escrow.amount.toFixed(2)}
                      </p>
                      {escrow.conditions && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                          {escrow.conditions}
                        </p>
                      )}
                    </div>
                    <Link to={`/escrows/${escrow.ID}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;