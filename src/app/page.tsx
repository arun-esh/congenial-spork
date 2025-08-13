"use client";

import { useEffect, useState } from 'react';
import AppHeader from "@/components/app-header";
import ServiceCard from "@/components/service-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Filter, Star } from 'lucide-react';
import { Service, ServiceAction } from '@/types';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllServices, setShowAllServices] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchServicesAndFavorites = async () => {
    setLoading(true);
    try {
      const [servicesRes, favoritesRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/favorites'),
      ]);
      const servicesData = await servicesRes.json();
      const favoritesData = await favoritesRes.json();
      
      setFavorites(favoritesData);
      const servicesWithFavorites = servicesData.map((service: Service) => ({
        ...service,
        is_favorite: favoritesData.includes(service.name),
      }));
      setServices(servicesWithFavorites);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndFavorites();
  }, []);

  const toggleFavorite = async (serviceName: string, isFavorite: boolean) => {
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceName }),
      });
      
      // Update favorites locally without refetching all services
      if (isFavorite) {
        setFavorites(prev => prev.filter(name => name !== serviceName));
        setServices(prev => prev.map(service => 
          service.name === serviceName 
            ? { ...service, is_favorite: false }
            : service
        ));
      } else {
        setFavorites(prev => [...prev, serviceName]);
        setServices(prev => prev.map(service => 
          service.name === serviceName 
            ? { ...service, is_favorite: true }
            : service
        ));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleServiceAction = async (action: ServiceAction) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });
      
      if (response.ok) {
        // Refresh services to get updated status
        await fetchServicesAndFavorites();
      } else {
        const errorData = await response.json();
        console.error('Service action failed:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to execute service action:', error);
    }
  };

  const refreshServices = async () => {
    setRefreshing(true);
    await fetchServicesAndFavorites();
    setRefreshing(false);
  };

  const favoriteServices = services.filter(service => service.is_favorite);
  const nonFavoriteServices = services.filter(service => !service.is_favorite);

  const filteredAllServices = nonFavoriteServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = { active: 0, inactive: 0, failed: 0, activating: 0, deactivating: 0 };
    services.forEach(service => {
      if (counts[service.status as keyof typeof counts] !== undefined) {
        counts[service.status as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Service Dashboard</h1>
            <Button onClick={refreshServices} disabled={refreshing} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
                <p className="text-sm text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">{statusCounts.inactive}</div>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{statusCounts.failed}</div>
                <p className="text-sm text-muted-foreground">Failed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.activating + statusCounts.deactivating}</div>
                <p className="text-sm text-muted-foreground">Transitioning</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
          </div>
        </div>

        

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading services...</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Favorite Services */}
            {favoriteServices.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Favorite Services
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoriteServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onToggleFavorite={toggleFavorite}
                      onServiceAction={handleServiceAction}
                    />
                  ))}
                </div>
              </div>
            )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for services..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

            {/* All Services Toggle */}
            <div className="text-center mb-6">
              <Button 
                onClick={() => setShowAllServices(!showAllServices)}
                variant="outline"
                size="lg"
              >
                {showAllServices ? 'Hide All Services' : 'Show All Services'}
              </Button>
            </div>

            {/* All Services */}
            {showAllServices && (
              <div>
                <h2 className="text-2xl font-bold mb-4">All Services</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAllServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onToggleFavorite={toggleFavorite}
                      onServiceAction={handleServiceAction}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}