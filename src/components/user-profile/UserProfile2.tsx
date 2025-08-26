'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Camera,
  Check,
  Phone,
  Mail,
  Globe,
  Bell,
  Settings,
  Edit2,
  X,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Award,
  Star,
  Calendar,
  Activity,
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuthContext } from '@/auth';

interface UserProfileProps {
  className?: string;
}

export const UserProfile2 = ({ className }: UserProfileProps) => {
  const [profileMobile, setProfileMobile] = useState('+971 9019122332');
  const [profileEmail, setProfileEmail] = useState('dubai.badass@email.com');
  const [languages, setLanguages] = useState('English, Arabic');
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [tempCountryCode, setTempCountryCode] = useState('+971');
  const [tempMobileNumber, setTempMobileNumber] = useState('9019122332');

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  const { authStorage } = useAuthContext();

  const { userCarActionCountsQuery } = useUserProfile({
    userId: authStorage.getUser()?.id.toString()!,
  });

  useEffect(() => {
    if (!userCarActionCountsQuery.isLoading) {
      const data = userCarActionCountsQuery.data;
      console.log('data: ', data);
    }
  }, [userCarActionCountsQuery.data]);

  const handleEditMobile = () => {
    const [code, number] = profileMobile.split(' ');
    setTempCountryCode(code);
    setTempMobileNumber(number);
    setIsEditingMobile(true);
  };

  const handleSaveMobile = () => {
    setProfileMobile(`${tempCountryCode} ${tempMobileNumber}`);
    setIsEditingMobile(false);
  };

  const handleCancelMobile = () => {
    setIsEditingMobile(false);
  };

  const handleEditEmail = () => {
    setTempEmail(profileEmail);
    setIsEditingEmail(true);
  };

  const handleSaveEmail = () => {
    setProfileEmail(tempEmail);
    setIsEditingEmail(false);
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
  };

  const stats = [
    {
      label: 'Total Enquiries',
      value: userCarActionCountsQuery.data?.enquired || 0,
      trend: '+12%',
      trendUp: true,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'This month',
    },
    {
      label: 'Saved Vehicles',
      value: userCarActionCountsQuery.data?.saved || 0,
      trend: '+8%',
      trendUp: true,
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      description: 'All time favorites',
    },
    {
      label: 'Profile Views',
      value: userCarActionCountsQuery.data?.viewed || 0,
      trend: '+24%',
      trendUp: true,
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Last 30 days',
    },
  ];

  const achievements = [
    {
      name: 'Early Adopter',
      icon: Award,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      name: 'Active User',
      icon: Activity,
      color: 'text-green-600 bg-green-100',
    },
    { name: 'Top Reviewer', icon: Star, color: 'text-blue-600 bg-blue-100' },
  ];

  const recentActivity = [
    { action: 'Viewed Mercedes C-Class', time: '2 hours ago', type: 'view' },
    { action: 'Saved BMW X5', time: '1 day ago', type: 'save' },
    { action: 'Enquired about Audi A6', time: '3 days ago', type: 'enquiry' },
  ];

  return (
    <div className={`mx-auto max-w-7xl space-y-8 p-6 ${className || ''}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">My Profile Dashboard</h1>
            <p className="text-lg text-orange-100">
              Manage your account and track your activity
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="border-white/30 bg-white/20 text-white backdrop-blur-sm"
            >
              <Settings className="mr-2 h-4 w-4" />
              Premium Member
            </Badge>
            <div className="text-right">
              <p className="text-sm text-orange-100">Member since</p>
              <p className="font-semibold">January 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {userCarActionCountsQuery.isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="relative p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="animate-pulse rounded-xl bg-gray-100 p-3">
                    <div className="h-6 w-6 rounded bg-gray-200"></div>
                  </div>
                  <div className="animate-pulse rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                    <div className="h-3 w-3 rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="h-8 animate-pulse rounded bg-gray-200"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : userCarActionCountsQuery.error ? (
          // Error state
          <div className="col-span-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-red-600">Failed to load user statistics</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => userCarActionCountsQuery.refetch()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Success state
          stats.map((stat, index) => (
            <Card
              key={index}
              className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`}
              ></div>
              <CardContent className="relative p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      stat.trendUp
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <TrendingUp
                      className={`h-3 w-3 ${stat.trendUp ? '' : 'rotate-180'}`}
                    />
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </h3>
                  <p className="font-medium text-gray-700">{stat.label}</p>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full cursor-pointer justify-center hover:bg-gray-50"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Settings className="h-5 w-5 text-orange-600" />
                </div>
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 shadow-lg ring-4 ring-white">
                    <AvatarImage
                      src="/professional-man-suit.png"
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-bold text-white">
                      DB
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 cursor-pointer rounded-full border-2 border-white bg-white p-0 shadow-lg hover:bg-orange-50"
                  >
                    <Camera className="h-4 w-4 text-orange-600" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-2xl font-bold text-gray-900">
                    Hello Dubai Badass
                  </h3>
                  <div className="mb-3 flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      <Star className="mr-1 h-3 w-3" />
                      Premium Member
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-600"
                    >
                      <Activity className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined Jan 2024
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      1.2k profile views
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Mobile Number
                  </Label>
                  {!isEditingMobile ? (
                    <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                      <span className="text-gray-900">{profileMobile}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditMobile}
                        className="cursor-pointer text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                      >
                        <Edit2 className="mr-1 h-4 w-4" />
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-lg border bg-blue-50 p-3">
                      <div className="flex gap-2">
                        <Select
                          value={tempCountryCode}
                          onValueChange={setTempCountryCode}
                        >
                          <SelectTrigger className="w-24 cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+971">🇦🇪 +971</SelectItem>
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91</SelectItem>
                            <SelectItem value="+966">🇸🇦 +966</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={tempMobileNumber}
                          onChange={(e) => setTempMobileNumber(e.target.value)}
                          placeholder="Enter mobile number"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveMobile}
                          className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelMobile}
                          className="cursor-pointer bg-transparent"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </Label>
                  {!isEditingEmail ? (
                    <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                      <span className="text-gray-900">{profileEmail}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditEmail}
                        className="cursor-pointer text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                      >
                        <Edit2 className="mr-1 h-4 w-4" />
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-lg border bg-blue-50 p-3">
                      <Input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEmail}
                          className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEmail}
                          className="cursor-pointer bg-transparent"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="h-4 w-4 text-gray-500" />
                    Languages I Speak
                  </Label>
                  <Input
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Enter languages you speak"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="flex items-center gap-2 font-medium text-gray-900">
                  <Bell className="h-4 w-4 text-gray-500" />
                  Notification Preferences
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <div className="flex-1">
                      <Label className="font-medium text-gray-900">
                        Push Notifications
                      </Label>
                      <p className="mt-1 text-sm text-red-600">
                        Alerts will not be shown when notifications are off
                      </p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                      className="cursor-pointer data-[state=checked]:bg-orange-500"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                    <div className="flex-1">
                      <Label className="font-medium text-gray-900">
                        Email Alerts
                      </Label>
                      <p className="mt-1 text-sm text-orange-600">
                        Get up to our yearly offers only. No spam for marketing
                        or ads.
                      </p>
                    </div>
                    <Switch
                      checked={emailAlerts}
                      onCheckedChange={setEmailAlerts}
                      className="cursor-pointer data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-xl">
                Save All Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Achievements Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="text-yellow-600 h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                >
                  <div className={`rounded-lg p-2 ${achievement.color}`}>
                    <achievement.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {achievement.name}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`mt-1 rounded-full p-1.5 ${
                      activity.type === 'view'
                        ? 'bg-purple-100'
                        : activity.type === 'save'
                          ? 'bg-red-100'
                          : 'bg-blue-100'
                    }`}
                  >
                    {activity.type === 'view' ? (
                      <Eye className="h-3 w-3 text-purple-600" />
                    ) : activity.type === 'save' ? (
                      <Heart className="h-3 w-3 text-red-600" />
                    ) : (
                      <MessageSquare className="h-3 w-3 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full cursor-pointer bg-transparent"
              >
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
