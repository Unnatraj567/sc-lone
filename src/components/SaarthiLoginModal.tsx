import React, { useState } from 'react';
import { Eye, EyeOff, X, Phone, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { AshokaEmblem } from './AshokaEmblem';

interface SaarthiLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string) => void;
}

export const SaarthiLoginModal: React.FC<SaarthiLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [password, setPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isOtpMode, setIsOtpMode] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess('Aditya');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      {/* Modal Dialog Card (Screen 8 from collage) */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
          {/* Left Visual Column (Screen 8 Left: Scenery with two people + Emblem + Saarthi) */}
          <div className="md:col-span-5 relative bg-gradient-to-br from-[#064e3b] via-[#0d5c46] to-[#042f24] text-white p-6 flex flex-col justify-between overflow-hidden">
            {/* Background glowing glow */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Branding Top */}
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300">
                <AshokaEmblem size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white font-serif">
                  Saarthi
                </h3>
                <p className="text-[11px] text-emerald-100/90 leading-tight">
                  Financial Support for a Stronger Tomorrow
                </p>
              </div>
            </div>

            {/* Scenic Vector Artwork: 2 silhouettes looking at sunrise mountains */}
            <div className="relative z-10 my-4 h-28 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-sky-300 via-amber-100 to-emerald-950">
              <svg viewBox="0 0 200 110" className="w-full h-full object-cover">
                {/* Sun */}
                <circle cx="100" cy="45" r="18" fill="#fde047" opacity="0.9" />
                {/* Mountain 1 */}
                <path d="M-10 80 L60 40 L120 75 L170 35 L210 80 L210 110 L-10 110 Z" fill="#475569" opacity="0.7" />
                {/* Mountain 2 */}
                <path d="M-10 90 L80 60 L140 85 L210 65 L210 110 L-10 110 Z" fill="#0f172a" opacity="0.9" />
                {/* Ground */}
                <path d="M-10 95 Q100 85 210 95 L210 110 L-10 110 Z" fill="#064e3b" />
                {/* Two traveler silhouettes */}
                <circle cx="92" cy="70" r="3.5" fill="#ffffff" />
                <path d="M89 74 L95 74 L94 92 L90 92 Z" fill="#ffffff" />
                <circle cx="106" cy="68" r="4" fill="#ffffff" />
                <path d="M103 72 L109 72 L108 92 L104 92 Z" fill="#ffffff" />
              </svg>
            </div>

            {/* Statutory text bottom */}
            <div className="relative z-10 text-[10px] text-emerald-200/80">
              Direct beneficiary concessional loan channel portal.
            </div>
          </div>

          {/* Right Form Column (Screen 8 Right: Login Form) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Welcome Back
                </h3>
                <p className="text-xs text-slate-500">
                  Login to your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Mobile Number input */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-medium text-slate-400">+91</span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile"
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                      required
                    />
                  </div>
                </div>

                {/* Password / OTP input */}
                {!isOtpMode ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsOtpMode(true)}
                        className="text-[11px] text-[#0d5c46] hover:underline cursor-pointer"
                      >
                        Login via OTP
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Enter 6-digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsOtpMode(false)}
                        className="text-[11px] text-[#0d5c46] hover:underline cursor-pointer"
                      >
                        Login via Password
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        placeholder="e.g. 548210"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
                      />
                      <button
                        type="button"
                        onClick={() => setOtpSent(true)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0d5c46] hover:bg-[#0a4635] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Login
                </button>
              </form>

              {/* Or continue with */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-2 text-[11px] text-slate-400">or continue with</span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => { onLoginSuccess('Aditya'); onClose(); }}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOtpMode(true)}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>OTP Login</span>
                </button>
              </div>
            </div>

            {/* Bottom Register Link */}
            <div className="pt-4 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { onLoginSuccess('Aditya'); onClose(); }}
                className="font-semibold text-[#0d5c46] hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
