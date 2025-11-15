export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Group2 App</h1>
        <p>Movie & TV Show Database</p>
        <div style={{ marginTop: '2rem' }}>
          <a href="/change-password" style={{
            color: '#4a90e2',
            textDecoration: 'none',
            fontSize: '1.1rem'
          }}>
            Change Password →
          </a>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Your teammates can add their pages here
        </p>
      </div>
    </div>
  )
}