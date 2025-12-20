'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Eye, Activity } from 'lucide-react';
import { useAppContext } from '@/context/useAppContext';
import { useQuery } from '@tanstack/react-query';
import { getUserCarActionCounts } from '@/lib/api/userProfile.api';
import EnquiredVehicles from './enquired-vehicles/EnquiredVehicles';
import SavedVehicles from './saved-vehicles/SavedVehicles';
import ViewedVehicles from './viewed-vehicles/ViewedVehicles';

interface UserActionsDashboardProps {
  className?: string;
  defaultTab?: 'enquired' | 'saved' | 'viewed';
}

const UserActionsDashboard: React.FC<UserActionsDashboardProps> = ({
  className = '',
  defaultTab = 'enquired',
}) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Use NextAuth session userId as primary source, fallback to auth context user
  const userId = session?.user?.id || user?.id || authStorage.getUser()?.id;

  // Get user action counts for badge display
  const { data: actionCounts } = useQuery({
    queryKey: ['userCarActionCounts', userId],
    queryFn: () => getUserCarActionCounts(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!userId) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">
            Please log in to view your vehicle activities.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tabs = [
    {
      value: 'enquired',
      label: 'Enquired',
      icon: MessageSquare,
      count: actionCounts?.enquired || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      value: 'saved',
      label: 'Saved',
      icon: Heart,
      count: actionCounts?.saved || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      value: 'viewed',
      label: 'Recently Viewed',
      icon: Eye,
      count: actionCounts?.viewed || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-blue-600" />
            My Vehicle Activities
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <tab.icon className={`h-4 w-4 ${tab.color}`} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <Badge
                  variant="secondary"
                  className={`ml-1 ${tab.bgColor} ${tab.textColor} text-xs`}
                >
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="enquired" className="mt-6">
          <EnquiredVehicles />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedVehicles />
        </TabsContent>

        <TabsContent value="viewed" className="mt-6">
          <ViewedVehicles />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserActionsDashboard;
