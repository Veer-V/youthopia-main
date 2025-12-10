
import { UserData } from '../types';
import { DB } from './db';

const USERS_KEY = 'yth_users';

export const AuthController = {
  login: async (email: string, password?: string): Promise<{ user: UserData | null, error?: string }> => {
    // Artificial delay removed for speed
    
    // 1. Static Admin/Executive Check
    if (email === 'admin@youthopia.com' && password === '123456') {
        return { user: { name: "System Admin", email, role: 'admin', school: 'System', class: 'N/A', stream: 'N/A', phone: 'N/A', age: 'N/A', gender: 'Other' } as UserData };
    }
    if (email === 'executive@youthopia.com' && password === '789') {
        return { user: { name: "Executive Director", email, role: 'executive', school: 'Board', class: 'N/A', stream: 'N/A', phone: 'N/A', age: 'N/A', gender: 'Other' } as UserData };
    }

    // 2. Custom Student Credential Check (Phone/Email)
    // Supports login via phone "9321549715" or email "aditya@youthopia.com" with password "Aditya@27"
    if ((email === '9321549715' || email.toLowerCase() === 'aditya@youthopia.com') && password === 'Aditya@27') {
        const hardcodedUser: UserData = { 
            name: "Aditya", 
            email: "aditya@youthopia.com", // Normalized email
            phone: "9321549715",
            role: 'student', 
            school: 'Youthopia High', 
            class: '12', 
            stream: 'Science', 
            age: '18', 
            gender: 'Male',
            bonus: 0 // Clean data default
        };

        // Ensure user exists in DB so points/registrations work properly across reloads
        const users = DB.read<UserData[]>(USERS_KEY, []);
        const existingUser = users.find(u => u.phone === '9321549715' || u.email === 'aditya@youthopia.com');
        
        if (!existingUser) {
            // First time login for this specific user, seed clean data
            DB.write(USERS_KEY, [...users, hardcodedUser]);
            return { user: hardcodedUser };
        } else {
             // Return existing persisted user state
             return { user: existingUser };
        }
    }

    // 3. Check Database
    // Note: For this local simulation, we look up the specific user key where password is stored
    const legacyKey = `user_${email.toLowerCase()}`;
    const storedUser = DB.read<any>(legacyKey, null);

    if (storedUser && storedUser.password === password) {
        // Return sanitized user object (remove password in real app)
        return { user: storedUser };
    }

    return { user: null, error: 'Invalid email/phone or password' };
  },

  register: async (userData: UserData, password?: string): Promise<{ success: boolean, error?: string }> => {
    // Artificial delay removed for speed
    
    const users = DB.read<UserData[]>(USERS_KEY, []);
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }

    // 1. Add to global registry
    const updatedUsers = [...users, { ...userData, bonus: userData.bonus || 0 }];
    DB.write(USERS_KEY, updatedUsers);

    // 2. Create individual record (Simulating Auth Table with Password)
    if (password) {
        DB.write(`user_${userData.email.toLowerCase()}`, { ...userData, password });
    }

    return { success: true };
  }
};
