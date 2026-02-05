export interface SweepData {
  id: string;
  name: string;
  zone: string;
  position: number;
  isRunning: boolean;
  throughput: number;
  targetThroughput: number;
  temperature: number;
  humidity: number;
  status: "optimal" | "warning" | "stopped" | "error";
}

// Hardcoded mock data to prevent hydration issues
export const mockSweepData: SweepData[] = [
  {
    id: "SA-001",
    name: "Raptor Sweep 1",
    zone: "Madison",
    position: 45,
    isRunning: false,
    throughput: 78.5,
    targetThroughput: 80.0,
    temperature: 72.3,
    humidity: 48.7,
    status: "optimal",
  },
  {
    id: "SA-002",
    name: "Raptor Sweep 2",
    zone: "Zone A",
    position: 45,
    isRunning: false,
    throughput: 78.5,
    targetThroughput: 80.0,
    temperature: 72.3,
    humidity: 48.7,
    status: "optimal",
  },
  {
    id: "SA-003",
    name: "Raptor Sweep 2",
    zone: "Zone A",
    position: 45,
    isRunning: false,
    throughput: 78.5,
    targetThroughput: 80.0,
    temperature: 72.3,
    humidity: 48.7,
    status: "optimal",
  },
  {
    id: "SA-004",
    name: "Raptor Sweep 3",
    zone: "Zone A",
    position: 90,
    isRunning: false,
    throughput: 78.5,
    targetThroughput: 80.0,
    temperature: 72.3,
    humidity: 48.7,
    status: "optimal",
  },
  {
    id: "SA-005",
    name: "Raptor Sweep 4",
    zone: "Zone A",
    position: 45,
    isRunning: false,
    throughput: 78.5,
    targetThroughput: 80.0,
    temperature: 72.3,
    humidity: 48.7,
    status: "optimal",
  },
  {
    id: "SA-006",
    name: "Raptor Sweep 5",
    zone: "Zone A",
    position: 73,
    isRunning: false,
    throughput: 78.5,
    targetThroughput: 80.0,
    temperature: 72.3,
    humidity: 48.7,
    status: "optimal",
  },
];
