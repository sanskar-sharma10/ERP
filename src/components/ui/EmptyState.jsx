/**
 * EmptyState — shown when a table or list has no data
 */
export default function EmptyState({ message = 'No records found.', colSpan = 1 }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
        }}
      >
        {message}
      </td>
    </tr>
  );
}
