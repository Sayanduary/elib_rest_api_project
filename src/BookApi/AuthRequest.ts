import type { Request } from "express";

export interface AuthRequest extends Request {
   userId?: string; // optional -> becomes required after auth middleware
}
