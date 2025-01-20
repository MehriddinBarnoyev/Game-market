import { NextResponse } from 'next/server';

const API_URL_USERS = 'https://676112646be7889dc35fa055.mockapi.io/users';
const API_URL_ADMINS = 'https://676112646be7889dc35fa055.mockapi.io/admins';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Fetch users and admins
    const userAuthResponse = await fetch(`${API_URL_USERS}?email=${email}`);
    const adminsAuthResponse = await fetch(API_URL_ADMINS);

    // Handle fetch errors
    if (!userAuthResponse.ok || !adminsAuthResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user or admin data' },
        { status: 500 }
      );
    }

    const users = await userAuthResponse.json();
    const admins = await adminsAuthResponse.json();

    // Find user or admin
    const user = users.find((u) => u.email === email && u.password === password);
    const admin = admins.find((a) => a.email === email && a.password === password);

    // Respond based on authentication result
    if (user) {
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } else if (admin) {
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: 'admin', // Assuming role should be admin for admins
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
