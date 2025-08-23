'use client';

import { useState } from 'react';
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
} from 'lucide-react';

interface UserProfileProps {
  className?: string;
}

export const UserProfile = ({ className }: UserProfileProps) => {
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
    { label: 'Enquiries', value: 31, color: 'bg-blue-50 text-blue-700' },
    { label: 'Saved', value: 921, color: 'bg-green-50 text-green-700' },
    { label: 'Viewed', value: 1009, color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className={`mx-auto max-w-4xl space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          <Settings className="mr-1 h-3 w-3" />
          Settings
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo and Name */}
              <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src="/professional-man-suit.png"
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-orange-100 text-lg font-semibold text-orange-700">
                      DB
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-7 w-7 cursor-pointer rounded-full bg-white p-0 shadow-sm hover:bg-orange-50"
                  >
                    <Camera className="h-3 w-3 text-orange-600" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hello Dubai Badass
                  </h3>
                  <p className="text-sm text-gray-500">Premium Member</p>
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

              <Button className="w-full cursor-pointer bg-orange-500 font-medium text-white hover:bg-orange-600">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${stat.color} mb-3`}
                >
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <h3 className="mb-2 font-medium text-gray-900">{stat.label}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer bg-transparent hover:border-orange-200 hover:bg-orange-50"
                >
                  View All
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
