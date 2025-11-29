export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        // Layering a dark gradient over a theater image to match the target look
        background: `
          linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)),
          url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: 'white'
      }}
    >
      {/* Navigation Header */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 3rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: '500' }}>MoviesApp</div>

        <a
          href="/login"
          style={{
            padding: '8px 24px',
            backgroundColor: '#ff0000', // Bright red
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'opacity 0.2s'
          }}
        >
          Sign In
        </a>
      </nav>

      {/* Main Hero Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
          marginTop: '-40px' // Slight visual offset to center vertically like the image
        }}
      >
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            maxWidth: '800px',
            lineHeight: '1.2'
          }}
        >
          Discover your next favorite film.
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            fontWeight: '500',
            marginBottom: '4rem'
          }}
        >
          Information for 1000s of movies, 100% free.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '1rem', fontWeight: '400' }}>Ready to explore? Create your account now!</p>

          <a
            href="/register"
            style={{
              padding: '16px 48px',
              backgroundColor: '#ff0000', // Bright red
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '1.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
