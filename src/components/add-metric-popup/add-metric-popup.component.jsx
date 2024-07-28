// src/components/add-metric-popup/add-metric-popup.component.jsx

import React, { useState, useContext } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import './add-metric-popup.styles.scss';

const AddMetricPopup = ({ onClose }) => {
  const { lifeSystemData, addNewMetric } = useContext(LifeSystemContext);
  const [newMetric, setNewMetric] = useState({
    category: '',
    name: '',
    conversionRule: '',
    fpPerUnit: 1,
    hasTiers: false,
    tiers: [{ limit: Infinity, fpPerUnit: 1 }],
    hasAttributes: false,
    attributes: [],
    value: 0
  });

  const existingCategories = [...new Set(lifeSystemData.map(metric => metric.category))];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMetric(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewMetric(prev => ({
      ...prev,
      category: selectedCategory === 'new' ? '' : selectedCategory
    }));
  };

  const handleTierChange = (index, field, value) => {
    const updatedTiers = newMetric.tiers.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    );
    setNewMetric(prev => ({ ...prev, tiers: updatedTiers }));
  };

  const addTier = () => {
    setNewMetric(prev => ({
      ...prev,
      tiers: [...prev.tiers, { limit: Infinity, fpPerUnit: 1 }]
    }));
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = newMetric.attributes.map((attr, i) => 
      i === index ? { ...attr, [field]: value } : attr
    );
    setNewMetric(prev => ({ ...prev, attributes: updatedAttributes }));
  };

  const addAttribute = () => {
    setNewMetric(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', modifier: 0 }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNewMetric(newMetric);
    onClose();
  };

  return (
    <div className="add-metric-popup">
      <div className="popup-content">
        <h2>Add New Metric</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Category:
              <select 
                value={existingCategories.includes(newMetric.category) ? newMetric.category : 'new'} 
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select a category</option>
                {existingCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="new">Add new category</option>
              </select>
            </label>
            {(!existingCategories.includes(newMetric.category) || newMetric.category === '') && (
              <input
                type="text"
                name="category"
                placeholder="New category"
                value={newMetric.category}
                onChange={handleInputChange}
                required
              />
            )}
          </div>
          <div>
            <label>
              Metric Name:
              <input type="text" name="name" value={newMetric.name} onChange={handleInputChange} required />
            </label>
          </div>
          <div>
            <label>
              Conversion Rule:
              <textarea name="conversionRule" value={newMetric.conversionRule} onChange={handleInputChange} required />
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" name="hasTiers" checked={newMetric.hasTiers} onChange={handleInputChange} />
              Has Tiers
            </label>
          </div>
          {newMetric.hasTiers && (
            <div>
              {newMetric.tiers.map((tier, index) => (
                <div key={index}>
                  <input
                    type="number"
                    value={tier.limit}
                    onChange={(e) => handleTierChange(index, 'limit', parseInt(e.target.value))}
                    placeholder="Limit"
                  />
                  <input
                    type="number"
                    value={tier.fpPerUnit}
                    onChange={(e) => handleTierChange(index, 'fpPerUnit', parseFloat(e.target.value))}
                    placeholder="FP per Unit"
                    step="0.1"
                  />
                </div>
              ))}
              <button type="button" onClick={addTier}>Add Tier</button>
            </div>
          )}
          {!newMetric.hasTiers && (
            <div>
              <label>
                FP per Unit:
                <input type="number" name="fpPerUnit" value={newMetric.fpPerUnit} onChange={handleInputChange} step="0.1" required />
              </label>
            </div>
          )}
          <div>
            <label>
              <input type="checkbox" name="hasAttributes" checked={newMetric.hasAttributes} onChange={handleInputChange} />
              Has Attributes
            </label>
          </div>
          {newMetric.hasAttributes && (
            <div>
              {newMetric.attributes.map((attr, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    placeholder="Attribute Name"
                  />
                  <input
                    type="number"
                    value={attr.modifier}
                    onChange={(e) => handleAttributeChange(index, 'modifier', parseFloat(e.target.value))}
                    placeholder="Modifier"
                    step="0.1"
                  />
                </div>
              ))}
              <button type="button" onClick={addAttribute}>Add Attribute</button>
            </div>
          )}
          <button type="submit">Add Metric</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddMetricPopup;