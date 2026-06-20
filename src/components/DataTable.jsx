import React from 'react';

const DataTable = ({ columns, data, actions }) => {
  return (
    <div className="table-container glass-panel">
      <table>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).filter(val => typeof val !== 'object' || React.isValidElement(val)).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              {actions && (
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {actions.map((action, idx) => (
                      <button 
                        key={idx} 
                        className={`btn ${action.type === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => action.onClick && action.onClick(row)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
