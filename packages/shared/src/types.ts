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
