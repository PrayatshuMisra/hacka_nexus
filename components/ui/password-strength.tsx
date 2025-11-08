"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export function PasswordStrength({ password, className = "" }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
      met: false,
    },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
      met: false,
    },
    {
      label: "Contains lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
      met: false,
    },
    {
      label: "Contains number",
      test: (pwd) => /\d/.test(pwd),
      met: false,
    },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      met: false,
    },
  ]);

  useEffect(() => {
    // Update requirements
    const updatedRequirements = requirements.map(req => ({
      ...req,
      met: req.test(password),
    }));
    setRequirements(updatedRequirements);

    // Calculate strength
    const metCount = updatedRequirements.filter(req => req.met).length;
    const strengthPercentage = (metCount / requirements.length) * 100;
    setStrength(strengthPercentage);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 20) return "Very Weak";
    if (strength <= 40) return "Weak";
    if (strength <= 60) return "Fair";
    if (strength <= 80) return "Good";
    return "Strong";
  };

  const getStrengthIcon = () => {
    if (strength <= 40) return <XCircle className="h-4 w-4 text-red-500" />;
    if (strength <= 60) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password Strength</span>
          <div className="flex items-center space-x-1">
            {getStrengthIcon()}
            <span className={`font-medium ${
              strength <= 40 ? 'text-red-600' : 
              strength <= 60 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {getStrengthText()}
            </span>
          </div>
        </div>
        <Progress 
          value={strength} 
          className="h-2" 
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">Requirements:</p>
        <div className="space-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              {req.met ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-400" />
              )}
              <span className={req.met ? "text-green-700" : "text-gray-500"}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 