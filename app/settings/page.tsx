'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Key,
  LogIn,
  LogOut,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Building,
  Globe,
  Monitor,
  Moon,
  Sun,
  Zap,
  Camera,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  company?: string;
  phone?: string;
  lastLogin?: Date;
  isOnline: boolean;
}

export default function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    desktop: true
  });
  
  // Login/Register forms
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    bio: ''
  });

  const [showRegister, setShowRegister] = useState(false);

  // Mock authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (loginForm.email && loginForm.password) {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: loginForm.email,
          role: 'admin',
          company: 'Transport Solutions Ltd',
          phone: '+40 123 456 789',
          lastLogin: new Date(),
          isOnline: true
        };
        setUser(mockUser);
        setProfileForm({
          name: mockUser.name,
          email: mockUser.email,
          company: mockUser.company || '',
          phone: mockUser.phone || '',
          bio: 'Fleet manager with 10+ years experience'
        });
        setIsLoggedIn(true);
        setActiveTab('profile');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: '2',
        name: registerForm.name,
        email: registerForm.email,
        role: 'user',
        company: registerForm.company,
        isOnline: true
      };
      setUser(newUser);
      setIsLoggedIn(true);
      setActiveTab('profile');
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', company: '' });
    setActiveTab('account');
  };

  const handleProfileSave = () => {
    // Update user profile
    if (user) {
      setUser({
        ...user,
        name: profileForm.name,
        email: profileForm.email,
        company: profileForm.company,
        phone: profileForm.phone
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                {showRegister ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {showRegister 
                  ? 'Join Fleetopia.co to manage your transport paradise'
                  : 'Sign in to your Fleetopia.co account'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!showRegister ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-300">Company</Label>
                      <Input
                        id="company"
                        placeholder="Transport Co"
                        value={registerForm.company}
                        onChange={(e) => setRegisterForm({...registerForm, company: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-gray-300">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="john@company.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-gray-300">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating account...
                      </div>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              )}
              
              <div className="text-center pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  {showRegister 
                    ? 'Already have an account?'
                    : "Don't have an account?"
                  }
                  <Button
                    variant="link"
                    className="text-blue-400 hover:text-blue-300 p-0 ml-1"
                    onClick={() => setShowRegister(!showRegister)}
                  >
                    {showRegister ? 'Sign in' : 'Create one'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Online</span>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-600 text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* User Info Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                    <p className="text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      {user.company && (
                        <span className="text-sm text-gray-500">• {user.company}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Last login</p>
                    <p className="text-sm text-white">
                      {user.lastLogin?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="system">
                <Database className="w-4 h-4 mr-2" />
                System
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Email</Label>
                      <Input
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Company</Label>
                      <Input
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Phone</Label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Bio</Label>
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleProfileSave} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Current Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">New Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Confirm New Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Key className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-400">Browser push notifications</p>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-400">Important alerts via SMS</p>
                      </div>
                      <Switch 
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Desktop Notifications</p>
                        <p className="text-sm text-gray-400">System desktop notifications</p>
                      </div>
                      <Switch 
                        checked={notifications.desktop}
                        onCheckedChange={(checked) => setNotifications({...notifications, desktop: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Appearance Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize the look and feel of your interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="w-4 h-4 mr-2" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="w-4 h-4 mr-2" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center">
                            <Monitor className="w-4 h-4 mr-2" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">System Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    View system status and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Version</Label>
                      <div className="text-white">v1.0.0</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Build</Label>
                      <div className="text-white">20241215-1</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Environment</Label>
                      <div className="text-white">Production</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Status</Label>
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Healthy
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4">
                    <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
