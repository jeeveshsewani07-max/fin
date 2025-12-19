import React, { useState } from 'react';
import { Car, MapPin, Clock, Accessibility, Bus, Train } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function RidesPage() {
  const [pickup, setPickup] = useState('Home (123 Oak Street)');
  const [destination, setDestination] = useState('');
  const [wheelchairAccess, setWheelchairAccess] = useState(false);

  const quickDestinations = [
    { name: 'Apollo Hospital', address: '45 Medical Plaza', icon: '🏥' },
    { name: 'City Mall', address: '67 Shopping District', icon: '🛍️' },
    { name: 'SBI Bank', address: '12 Main Street', icon: '🏦' },
    { name: 'Temple', address: '89 Temple Road', icon: '🕉️' }
  ];

  const busRoutes = [
    { route: 'Route 42', destination: 'City Hospital', nextBus: '5 min', fare: '₹15' },
    { route: 'Route 18', destination: 'Shopping Mall', nextBus: '12 min', fare: '₹12' },
    { route: 'Route 7', destination: 'Railway Station', nextBus: '18 min', fare: '₹10' }
  ];

  const trainSchedule = [
    { train: 'Local Express', platform: '2', departure: '6:45 PM', destination: 'Central Station' },
    { train: 'City Metro', platform: '1', departure: '7:15 PM', destination: 'Airport' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Rides & Transport</h1>

      <Tabs defaultValue="cab" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cab">Book a Cab</TabsTrigger>
          <TabsTrigger value="bus">Bus Routes</TabsTrigger>
          <TabsTrigger value="train">Train Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="cab" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car size={24} />
                Book Your Ride
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      id="pickup"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="pl-10 h-12"
                      placeholder="Enter pickup location"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10 h-12"
                      placeholder="Where would you like to go?"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="wheelchair" 
                    checked={wheelchairAccess}
                    onCheckedChange={(checked) => setWheelchairAccess(checked as boolean)}
                  />
                  <Label htmlFor="wheelchair" className="flex items-center gap-2">
                    <Accessibility size={20} />
                    Wheelchair accessible vehicle only
                  </Label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Quick Destinations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickDestinations.map((dest, index) => (
                    <button
                      key={index}
                      onClick={() => setDestination(dest.address)}
                      className="p-4 text-left bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dest.icon}</span>
                        <div>
                          <p className="font-medium">{dest.name}</p>
                          <p className="text-sm text-muted-foreground">{dest.address}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14"
                disabled={!destination}
              >
                <Car size={20} className="mr-2" />
                Book Cab Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">To Apollo Hospital</p>
                    <p className="text-sm text-muted-foreground">Yesterday, 2:30 PM • ₹180</p>
                  </div>
                  <Button variant="outline" size="sm">Book Again</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">To City Mall</p>
                    <p className="text-sm text-muted-foreground">2 days ago, 11:00 AM • ₹120</p>
                  </div>
                  <Button variant="outline" size="sm">Book Again</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus size={24} />
                Live Bus Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {busRoutes.map((bus, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
                        {bus.route}
                      </div>
                      <div>
                        <p className="font-medium">{bus.destination}</p>
                        <p className="text-sm text-muted-foreground">Fare: {bus.fare}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{bus.nextBus}</p>
                      <p className="text-sm text-muted-foreground">Next bus</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="train" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train size={24} />
                Train Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainSchedule.map((train, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <div>
                      <p className="font-medium">{train.train}</p>
                      <p className="text-sm text-muted-foreground">To {train.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{train.departure}</p>
                      <p className="text-sm text-muted-foreground">Platform {train.platform}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}