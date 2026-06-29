import { useConnection } from '../../context/ConnectionContext.jsx';

/**
 * App-wide top header bar
 */
export default function Header() {
  const { connectionStatus } = useConnection();
  const isConnected = connectionStatus === 'connected';

  return (
    <header className="app-header">
      <div className="brand-section">
        <h1>
          Univers-<span>One</span>
        </h1>
        <p>Engineered by Optatech Innovation</p>
      </div>

      <div
        className={`status-badge ${isConnected ? 'connected' : 'offline'}`}
        title={
          isConnected
            ? 'Connected to live backend'
            : 'Backend offline — running in sandbox mode'
        }
      >
        <div className="status-dot" />
        {isConnected ? 'LIVE NODE LINKED' : 'SANDBOXED OFFLINE'}
      </div>
    </header>
  );
}
