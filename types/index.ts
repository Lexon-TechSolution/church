
export type UserRole = 'admin' | 'pastor' | 'accountant' | 'reception';

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  full_name?: string;
}

export interface Member {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  birth_date?: string; 
  location?: string;
  group_name?: string;
  // Tribe property used in Members.tsx
  tribe?: string;
  join_date: string;
  created_at: string;
}

export interface Visitor {
  id: string;
  full_name: string;
  phone: string;
  origin: string; 
  // Location property used in Visitors.tsx
  location?: string;
  email?: string;
  reason?: string;
  // Follow up status used in Visitors.tsx
  follow_up_sent?: boolean;
  visit_date: string;
  created_at: string;
}

export interface Asset {
  id: string;
  name: string;
  category: 'Land' | 'Building' | 'Equipment' | 'Vehicle' | 'Other';
  value: number;
  condition: string;
  purchased_date: string;
}

export interface Pledge {
  id: string;
  member_id: string;
  member_name: string;
  purpose: string;
  target_amount: number;
  paid_amount: number;
  due_date: string;
  status: 'pending' | 'partially_paid' | 'completed';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  status?: 'approved' | 'pending' | 'rejected'; // Imeongezwa kwa ajili ya idhini
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  phone: string;
}
