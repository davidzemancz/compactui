export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  joined: string;
  lastLogin: string;
}

// Predefined values for consistent sample data
const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer', 'Tester'];
const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'David', 'Emma', 'Frank'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller'];

/**
 * Generates sample user data for demos
 * @param count Number of users to generate
 * @returns Array of user objects
 */
export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = (i + 1).toString();
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const active = Math.random() > 0.3;

    // Generate random dates
    const now = new Date();
    const joinedDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const lastLoginDate = new Date(joinedDate.getTime() + Math.random() * (now.getTime() - joinedDate.getTime()));

    const joined = joinedDate.toISOString().slice(0, 10);
    const lastLogin = lastLoginDate.toISOString().slice(0, 10);

    return { id, name, email, role, active, joined, lastLogin };
  });
};

/**
 * Gets a list of unique roles for filter options
 */
export const getUserRoleOptions = () => {
  return roles.map(role => ({ value: role, label: getRoleLabel(role) }));
};

/**
 * Converts role values to human-readable Czech labels
 */
const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'Admin': return 'Administrátor';
    case 'User': return 'Uživatel';
    case 'Manager': return 'Manažer';
    case 'Developer': return 'Vývojář';
    case 'Designer': return 'Designér';
    case 'Tester': return 'Tester';
    default: return role;
  }
};
