// User Actions Components
export { default as EnquiredVehicles } from "./enquired-vehicles/EnquiredVehicles";
export { default as SavedVehicles } from "./saved-vehicles/SavedVehicles";
export { default as ViewedVehicles } from "./viewed-vehicles/ViewedVehicles";

// Re-export types for convenience
export type {
  EnquiredVehicle,
  SavedVehicle,
  ViewedVehicle,
  Vehicle,
  UserAction,
} from "@/lib/api/userActions.api.types";

// Re-export hooks for convenience
export { useUserActions } from "@/hooks/useUserActions";
