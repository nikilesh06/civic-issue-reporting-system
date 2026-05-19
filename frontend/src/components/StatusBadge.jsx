const StatusBadge = ({ status }) => {
  const map = {
    'Pending':     { cls: 'badge badge-pending',  dot: '#f59e0b' },
    'In Progress': { cls: 'badge badge-progress', dot: '#0284c7' },
    'Resolved':    { cls: 'badge badge-resolved', dot: '#10b981' },
  };
  const s = map[status] || map['Pending'];
  return (
    <span className={s.cls}>
      <span style={{ width:6, height:6, borderRadius:'50%', background: s.dot, display:'inline-block' }} />
      {status}
    </span>
  );
};

export default StatusBadge;
