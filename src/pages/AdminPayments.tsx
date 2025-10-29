import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useWallet } from '@/hooks/useWallet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Shield, Lock, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPayments = () => {
  const { walletState } = useWallet();
  const [failedPayments, setFailedPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const ADMIN_ACCOUNTS = import.meta.env.VITE_ADMIN_ACCOUNTS?.split(',').map((a: string) => a.trim()) || [];
  const isAdmin = walletState.isConnected && ADMIN_ACCOUNTS.includes(walletState.account?.accountId || '');

  const fetchFailedPayments = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch('http://localhost:3001/api/admin/failed-payments');
      const data = await response.json();
      setFailedPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching failed payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchFailedPayments();
    }
  }, [isAdmin]);

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto border-destructive/20">
            <CardHeader className="text-center">
              <Lock className="h-16 w-16 mx-auto text-destructive mb-4" />
              <CardTitle className="text-3xl">Admin Access Required</CardTitle>
              <CardDescription className="text-base">
                Connect your wallet to access the admin panel
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto border-destructive/20">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
              <CardTitle className="text-3xl">Access Denied</CardTitle>
              <CardDescription className="text-base">
                Your account is not authorized to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-2">Connected Account:</p>
                <code className="text-sm font-mono">{walletState.account?.accountId}</code>
              </div>
              <p className="text-xs text-muted-foreground">
                Only authorized GamersNFT administrators can access this area
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Shield className="h-10 w-10 text-primary" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Activity className="h-3 w-3" />
                  Authorized
                </Badge>
                <code className="text-sm">{walletState.account?.accountId}</code>
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="failed-payments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="failed-payments">Failed Payments</TabsTrigger>
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="failed-payments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Failed Payments
                    </CardTitle>
                    <CardDescription>Payments requiring manual refunds</CardDescription>
                  </div>
                  <Button onClick={fetchFailedPayments} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : failedPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No failed payments found</p>
                    <p className="text-xs text-muted-foreground mt-2">All transactions processed successfully</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {failedPayments.map((payment: any) => (
                      <div key={payment.id} className="border rounded-lg p-4 bg-destructive/5">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">NFT ID:</span>
                            <p className="font-mono">{payment.nft_id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-semibold">{payment.amount} HBAR</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Buyer:</span>
                            <p className="font-mono text-xs">{payment.buyer_account_id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Seller:</span>
                            <p className="font-mono text-xs">{payment.seller_account_id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="destructive">{payment.status}</Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Payment TX:</span>
                            <p className="font-mono text-xs">{payment.payment_tx_id || 'N/A'}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Error:</span>
                            <p className="text-xs mt-1">{payment.error_message}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Date:</span>
                            <p className="text-xs">{new Date(payment.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                          <p className="text-sm font-semibold">⚠️ Action Required:</p>
                          <p className="text-sm mt-1">Manually refund {payment.amount} HBAR to {payment.buyer_account_id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardDescription>Platform Account</CardDescription>
                  <CardTitle className="text-sm font-mono">{import.meta.env.VITE_MY_ACCOUNT_ID}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Network</CardDescription>
                  <CardTitle>Hedera Testnet</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Platform Fee</CardDescription>
                  <CardTitle className="text-primary">2.5%</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPayments;
