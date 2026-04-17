'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const roles = [
  { id: 'admin', label: 'Admin', icon: '👑' },
  { id: 'doctor', label: 'Doctor', icon: '⚕️' },
  { id: 'receptionist', label: 'Receptionist', icon: '📋' },
];

// Professional background images (Ayurveda / wellness theme)
const backgroundImages = [
  'https://media.istockphoto.com/id/697860312/photo/indian-ayurvedic-dietary-supplement-called-chyawanprash-chyavanaprasha-is-a-cooked-mixture-of.jpg?s=612x612&w=0&k=20&c=outabsxtvdSSt4aCkRdjtKrVtv7qko4N6AMA6qVtWmo=',
  'https://plus.unsplash.com/premium_photo-1682098137061-37ad1237ce57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXl1cnZlZGljfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1726146198233-f4ee5dcbe49c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGF5dXJ2ZWRpY3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1521146250551-a5578dcc2e64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXl1cnZlZGljfGVufDB8fDB8fHww',
  "https://plus.unsplash.com/premium_photo-1694412516047-c9ef201f9564?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXl1cnZlZGljJTIwaGVyYnN8ZW58MHx8MHx8fDA%3D",
];

const roleRedirects: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  doctor: '/doctor/dashboard',
  receptionist: '/receptionist/dashboard',
  patient: '/patient/dashboard',
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [bgImage, setBgImage] = useState('');

  // Random background image on mount
  useEffect(() => {
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBgImage(randomImage);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      const redirectPath = roleRedirects[selectedRole];
      router.push(redirectPath);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-900">
        
        {/* Left: Branding Panel */}
        <div 
          className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium tracking-widest">
              ANCIENT WISDOM • MODERN CARE
            </div>
            
            <h1 className="mt-8 text-5xl font-light tracking-tight">Ayurved</h1>
            <p className="text-2xl text-emerald-400 font-medium mt-1">The Digital Apothecary</p>
            
            <p className="mt-6 text-slate-300 max-w-sm leading-relaxed text-[15px]">
              Secure access to traditional healthcare records, herbal inventory, and personalized treatment protocols.
            </p>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <div className="text-4xl font-semibold">12K+</div>
              <div className="text-slate-400 text-xs mt-1">TREATMENTS</div>
            </div>
            <div>
              <div className="text-4xl font-semibold">98%</div>
              <div className="text-slate-400 text-xs mt-1">ACCURACY</div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 lg:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-white">Welcome Back</h2>
              <p className="text-slate-400 mt-2 text-sm">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-4 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id as UserRole)}
                    className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 border text-sm font-medium ${
                      selectedRole === role.id 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm' 
                        : 'border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-2 block">
                  Email / Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.sharma@ayurved.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                    Password
                  </label>
                  <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-2xl">
                  {error}
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 bg-slate-800 border-slate-600 rounded"
                />
                <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-emerald-500/20 disabled:opacity-70"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  color: '#0f172a',
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 text-center text-xs text-slate-500">
              Demo: <span className="text-emerald-300">admin@ayurved.com</span> / <span className="text-emerald-300">demo123</span>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
              New to Ayurved?{' '}
              <a href="#" className="text-emerald-400 hover:text-emerald-300">Request Access</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}