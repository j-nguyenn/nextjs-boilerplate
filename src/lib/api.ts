// Example API service
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Editor' },
];

const POSTS: Post[] = [
  { id: 1, title: 'First Post', body: 'This is the first post content', userId: 1 },
  { id: 2, title: 'Second Post', body: 'This is the second post content', userId: 1 },
  { id: 3, title: 'Introduction', body: 'Welcome to our platform', userId: 2 },
  { id: 4, title: 'Tips and Tricks', body: 'Here are some useful tips', userId: 3 },
  { id: 5, title: 'Best Practices', body: 'Follow these best practices', userId: 2 },
  { id: 6, title: 'New Features', body: 'Check out our new features', userId: 5 },
  { id: 7, title: 'Getting Started', body: 'How to get started with our product', userId: 4 },
  { id: 8, title: 'Advanced Techniques', body: 'Learn advanced techniques', userId: 3 },
];

export const api = {
  getUsers: async (): Promise<User[]> => {
    // Simulate network delay
    await delay(800);
    return [...USERS];
  },
  
  getUser: async (id: number): Promise<User> => {
    await delay(500);
    const user = USERS.find(user => user.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  },
  
  getPosts: async (): Promise<Post[]> => {
    await delay(1000);
    return [...POSTS];
  },
  
  getPostsByUser: async (userId: number): Promise<Post[]> => {
    await delay(700);
    return POSTS.filter(post => post.userId === userId);
  },
  
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    await delay(1200);
    const newUser = {
      id: Math.max(...USERS.map(u => u.id)) + 1,
      ...user
    };
    USERS.push(newUser);
    return newUser;
  },
  
  updateUser: async (id: number, updates: Partial<Omit<User, 'id'>>): Promise<User> => {
    await delay(800);
    const index = USERS.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    
    USERS[index] = { ...USERS[index], ...updates };
    return USERS[index];
  },
  
  deleteUser: async (id: number): Promise<void> => {
    await delay(600);
    const index = USERS.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    
    USERS.splice(index, 1);
  }
};