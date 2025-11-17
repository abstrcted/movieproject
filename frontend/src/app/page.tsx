export default function HomePage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div
        style={{
          textAlign: 'center',
          background: 'white',
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px'
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1a202c' }}>🎬 Movie App</h1>
        <p style={{ color: '#718096', marginBottom: '2rem' }}>Discover amazing movies and TV shows</p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '2rem'
          }}
        >
          <a
            href="/register"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'transform 0.2s'
            }}
          >
            Create Account
          </a>

          <a
            href="/login"
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              border: '2px solid #667eea',
              transition: 'transform 0.2s'
            }}
          >
            Sign In
          </a>

          <a
            href="/change-password"
            style={{
              color: '#718096',
              textDecoration: 'none',
              fontSize: '0.9rem',
              marginTop: '0.5rem'
            }}
          >
            Forgot Password?
          </a>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#a0aec0' }}>Group 2 - TCSS 460</p>
      </div>
    </div>
  );
}
