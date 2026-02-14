import React, { useState } from 'react';
import { theme } from "@/styles/theme";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, type = "text", ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ 
        fontSize: "14px", 
        marginBottom: "5px", 
        display: "block",
        color: "var(--foreground)",
        fontWeight: 500
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={inputType}
          {...props}
          style={{
            width: "100%",
            height: "45px",
            padding: "0 12px",
            paddingRight: isPassword ? "40px" : "12px",
            borderRadius: "10px",
            border: `1px solid ${isFocused || isHovered ? theme.colors.primary : "var(--border)"}`,
            color: "var(--foreground)",
            background: "var(--card-bg)",
            fontSize: "15px",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: isFocused ? `0 0 0 3px ${theme.colors.primary}20` : "none"
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px"
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
