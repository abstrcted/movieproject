'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('User');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on client side only
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (!session || !session.user) {
          router.push('/login');
          return;
        }

        setUserName(session.user.name || session.user.email || 'User');
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {userName}! 🎬</h1>
        <p className="subtitle">Ready to discover amazing movies and shows?</p>
      </div>

      <div className="dashboard-grid">
        {/* Explore Movies Section */}
        <div className="dashboard-card explore-card" onClick={() => router.push('/browse')}>
          <div className="card-icon">🎬</div>
          <h2>Explore Movies</h2>
          <p>Browse our extensive collection of movies</p>
          <button className="card-button">Browse Now →</button>
        </div>

        {/* My Account Section */}
        <div className="dashboard-card" onClick={() => router.push('/account')}>
          <div className="card-icon">👤</div>
          <h2>My Account</h2>
          <p>View and manage your profile settings</p>
          <button className="card-button">View Profile →</button>
        </div>

        {/* Watchlist Section */}
        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h2>My Watchlist</h2>
          <p>Keep track of movies you want to watch</p>
          <button className="card-button">View List →</button>
        </div>

        {/* Recently Viewed Section */}
        <div className="dashboard-card">
          <div className="card-icon">🕒</div>
          <h2>Recently Viewed</h2>
          <p>Continue watching where you left off</p>
          <button className="card-button">See History →</button>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => router.push('/browse')}>
            🔍 Search Movies
          </button>
          <button className="action-btn" onClick={() => router.push('/change-password')}>
            🔒 Change Password
          </button>
          <button
            className="action-btn danger"
            onClick={() => {
              router.push('/api/auth/signout');
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
