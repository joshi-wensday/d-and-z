// src/pages/conversion-rules/conversion-rules.component.jsx

import React, { useContext, useState } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import './conversion-rules.styles.scss';

const ConversionRules = () => {
  const { conversionRules, updateConversionRule } = useContext(LifeSystemContext);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setEditForm(rule);
  };

  const handleChange = (e) => {
    const value = e.target.name === 'fpPerUnit' ? parseFloat(e.target.value) : e.target.value;
    setEditForm({ ...editForm, [e.target.name]: value });
  };

  const handleSave = () => {
    updateConversionRule(editingId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="conversion-rules">
      <h1>Flame Point Conversion Rules</h1>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Metric</th>
            <th>Conversion Rule</th>
            <th>FP per Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {conversionRules.map(rule => (
            <tr key={rule.id}>
              <td>
                {editingId === rule.id ? (
                  <input name="category" value={editForm.category} onChange={handleChange} />
                ) : rule.category}
              </td>
              <td>
                {editingId === rule.id ? (
                  <input name="metric" value={editForm.metric} onChange={handleChange} />
                ) : rule.metric}
              </td>
              <td>
                {editingId === rule.id ? (
                  <input name="conversionRule" value={editForm.conversionRule} onChange={handleChange} />
                ) : rule.conversionRule}
              </td>
              <td>
                {editingId === rule.id ? (
                  <input name="fpPerUnit" type="number" step="0.1" value={editForm.fpPerUnit} onChange={handleChange} />
                ) : rule.fpPerUnit}
              </td>
              <td>
                {editingId === rule.id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(rule)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConversionRules;