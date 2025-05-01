
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to get getFromLocalStorage with type safety
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored) as T;
  } catch (e) {
    return defaultValue;
  }
}

// Helper to set localStorage with type safety
export function setToLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Format dates
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Format energy values
export function formatEnergy(value: number, unit: 'kWh' | 'MWh' = 'kWh'): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${unit}`;
}

// Calculate CO2 offset from energy (kWh)
export function calculateCO2Offset(energyKWh: number): number {
  // Approximation: 0.5 kg CO2 per kWh
  return energyKWh * 0.5;
}

// Calculate trees equivalent from CO2 (kg)
export function calculateTreesEquivalent(co2Kg: number): number {
  // Approximation: 22 kg CO2 per tree per year
  return co2Kg / 22;
}
