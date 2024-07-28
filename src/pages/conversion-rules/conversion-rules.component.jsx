// src/pages/conversion-rules/conversion-rules.component.jsx

import React, { useContext, useState } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import AddMetricPopup from '../../components/add-metric-popup/add-metric-popup.component';
import './conversion-rules.styles.scss';

const ConversionRules = () => {
  const { lifeSystemData, updateConversionRule, isLoading } = useContext(LifeSystemContext);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddMetricPopup, setShowAddMetricPopup] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setEditForm(rule);
  };

  const handleChange = (e, index = null, field = null) => {
    let value = e.target.value;
    if (e.target.type === 'number') {
      value = parseFloat(value);
    }

    if (index !== null && field !== null) {
      // Handling changes in tiers or attributes
      const newArray = [...editForm[field]];
      newArray[index] = { ...newArray[index], [e.target.name]: value };
      setEditForm({ ...editForm, [field]: newArray });
    } else {
      setEditForm({ ...editForm, [e.target.name]: value });
    }
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

  const removeTier = (index) => {
    const updatedTiers = editForm.tiers.filter((_, i) => i !== index);
    setEditForm({ ...editForm, tiers: updatedTiers });
  };

  const removeAttribute = (index) => {
    const updatedAttributes = editForm.attributes.filter((_, i) => i !== index);
    setEditForm({ ...editForm, attributes: updatedAttributes });
  };

  const renderRuleDetails = (rule) => {
    let details = rule.conversionRule;
    if (rule.tiers) {
      details += ' Tiers: ' + rule.tiers.map(tier => `Up to ${tier.limit}: ${tier.fpPerUnit} FP/unit`).join(', ');
    } else {
      details += ` ${rule.fpPerUnit} FP/unit`;
    }
    if (rule.attributes) {
      details += ' Attributes: ' + rule.attributes.map(attr => `${attr.name} (${attr.modifier})`).join(', ');
    }
    return details;
  };

  const renderEditFields = (rule) => (
    <>
      <input name="category" value={editForm.category} onChange={handleChange} />
      <input name="name" value={editForm.name} onChange={handleChange} />
      <textarea name="conversionRule" value={editForm.conversionRule} onChange={handleChange} />
      {rule.tiers && (
        <div>
          {editForm.tiers.map((tier, index) => (
            <div key={index}>
              <input 
                name="limit" 
                type="number" 
                value={tier.limit} 
                onChange={(e) => handleChange(e, index, 'tiers')} 
              />
              <input 
                name="fpPerUnit" 
                type="number" 
                step="0.1" 
                value={tier.fpPerUnit} 
                onChange={(e) => handleChange(e, index, 'tiers')} 
              />
              <button type="button" onClick={() => removeTier(index)}>Remove Tier</button>
            </div>
          ))}
        </div>
      )}
      {!rule.tiers && (
        <input name="fpPerUnit" type="number" step="0.1" value={editForm.fpPerUnit} onChange={handleChange} />
      )}
      {rule.attributes && (
        <div>
          {editForm.attributes.map((attr, index) => (
            <div key={index}>
              <input 
                name="name" 
                value={attr.name} 
                onChange={(e) => handleChange(e, index, 'attributes')} 
              />
              <input 
                name="modifier" 
                type="number" 
                step="0.1" 
                value={attr.modifier} 
                onChange={(e) => handleChange(e, index, 'attributes')} 
              />
              <button type="button" onClick={() => removeAttribute(index)}>Remove Attribute</button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="conversion-rules">
      <h1>Flame Point Conversion Rules</h1>
      <button onClick={() => setShowAddMetricPopup(true)}>Add New Metric</button>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Metric</th>
            <th>Conversion Rule & FP Calculation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lifeSystemData.map(rule => (
            <tr key={rule.id}>
              <td>{rule.category}</td>
              <td>{rule.name}</td>
              <td>{editingId === rule.id ? renderEditFields(rule) : renderRuleDetails(rule)}</td>
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
      {showAddMetricPopup && <AddMetricPopup onClose={() => setShowAddMetricPopup(false)} />}
    </div>
  );
};

export default ConversionRules;