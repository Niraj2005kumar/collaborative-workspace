const Sidebar = () => {
  return (
    <aside style={{ width: '220px', padding: '1rem', background: '#f3f4f6', minHeight: '100vh' }}>
      <h3>Workspace</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '0.5rem' }}>Dashboard</li>
        <li style={{ marginBottom: '0.5rem' }}>Projects</li>
        <li style={{ marginBottom: '0.5rem' }}>Members</li>
      </ul>
    </aside>
  )
}

export default Sidebar
