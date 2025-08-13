"use client";

import { useEffect, useState } from 'react';
import AppHeader from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  status: string;
  port: string;
  is_favorite: boolean;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllServices, setShowAllServices] = useState(false);

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
      await fetchServicesAndFavorites(); // Refresh the list
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteServices = filteredServices.filter(service => service.is_favorite);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-center mb-4">
          <Input
            type="search"
            placeholder="Search for services..."
            className="w-full max-w-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Favorite Services</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {service.name}
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(service.name, service.is_favorite)}>
                        <Star className={service.is_favorite ? 'fill-yellow-400' : ''} />
                      </Button>
                    </CardTitle>
                    <CardDescription>Port: {service.port}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={service.status === 'active' ? 'default' : 'destructive'}>
                      {service.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button onClick={() => setShowAllServices(!showAllServices)}>
                {showAllServices ? 'Hide All Services' : 'Show All Services'}
              </Button>
            </div>
            {showAllServices && (
              <div>
                <h2 className="text-2xl font-bold mt-8 mb-4">All Services</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredServices.map((service) => (
                    <Card key={service.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {service.name}
                          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(service.name, service.is_favorite)}>
                            <Star className={service.is_favorite ? 'fill-yellow-400' : ''} />
                          </Button>
                        </CardTitle>
                        <CardDescription>Port: {service.port}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant={service.status === 'active' ? 'default' : 'destructive'}>
                          {service.status}
                        </Badge>
                      </CardContent>
                    </Card>
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
