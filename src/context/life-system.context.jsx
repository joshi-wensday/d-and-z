// src/context/life-system.context.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './auth.context';
import {
  getLifeSystemData,
  updateLifeSystemData,
  getDailyLogs,
  updateDailyLogs,
  addUserDailyLog,
  addUserMetric,
  addDoc,
  collection,
  db,
  auth
} from '../utils/firebase/firebase.utils';

export const LifeSystemContext = createContext();

export const LifeSystemProvider = ({ children }) => {
  const [lifeSystemData, setLifeSystemData] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentLog, setCurrentLog] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedLifeSystemData = await getLifeSystemData(isDemo);
        setLifeSystemData(fetchedLifeSystemData);

        const fetchedDailyLogs = await getDailyLogs(isDemo);
        setDailyLogs(fetchedDailyLogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user || isDemo) {
      fetchData();
    }
  }, [user, isDemo]);

  useEffect(() => {
    const log = dailyLogs.find(log => {
      const logDate = log.date instanceof Date ? log.date : log.date.toDate();
      return logDate.toDateString() === new Date(currentDate).toDateString();
    });
    if (log) {
      setCurrentLog(log);
    } else {
      const newLog = {
        date: new Date(currentDate),
        metrics: lifeSystemData.map(metric => ({ ...metric, value: 0, attributeValues: {} }))
      };
      setCurrentLog(newLog);
      setDailyLogs(prevLogs => [...prevLogs, newLog]);
    }
  }, [currentDate, dailyLogs, lifeSystemData]);

  const updateMetric = async (id, newValue, attributes = {}) => {
    const metricsData = await getLifeSystemData(isDemo);
    let updatedLog;

    if (currentLog) {
      updatedLog = {
        ...currentLog,
        metrics: currentLog.metrics.map(metric => {
          if (metric.id === id) {
            const fullMetric = metricsData.find(m => m.id === id);
            return {
              ...fullMetric,
              value: parseInt(newValue) || 0,
              attributeValues: { ...metric.attributeValues, ...attributes }
            };
          }
          return metric;
        })
      };
    } else {
      updatedLog = {
        date: new Date(currentDate),
        metrics: metricsData.map(metric => {
          if (metric.id === id) {
            return {
              ...metric,
              value: parseInt(newValue) || 0,
              attributeValues: attributes
            };
          }
          return {
            ...metric,
            value: 0,
            attributeValues: {}
          };
        })
      };
    }

    await updateDailyLogs([updatedLog], isDemo);
    setDailyLogs(prevLogs => {
      const newLogs = currentLog
        ? prevLogs.map(log => log.id === updatedLog.id ? updatedLog : log)
        : [...prevLogs, updatedLog];
      return newLogs;
    });
    setCurrentLog(updatedLog);
  };

  const addDailyLog = async (logData) => {
    const metricsData = await getLifeSystemData(isDemo);
    const updatedMetrics = logData.metrics.map(metric => {
      const fullMetric = metricsData.find(m => m.id === metric.id);
      return {
        ...fullMetric,
        value: metric.value,
        attributeValues: metric.attributeValues || {}
      };
    });
    const newLog = {
      ...logData,
      metrics: updatedMetrics
    };
    const addedLog = await addUserDailyLog(isDemo ? 'demoData' : user.uid, newLog);
    setDailyLogs([...dailyLogs, addedLog]);
  };

  const calculateFlamePoints = (metrics) => {
    return metrics.reduce((total, metric) => {
      let points = 0;
      if (metric.tiers) {
        let remainingValue = metric.value;
        for (const tier of metric.tiers) {
          const valueInTier = Math.min(remainingValue, tier.limit);
          points += valueInTier * tier.fpPerUnit;
          remainingValue -= valueInTier;
          if (remainingValue <= 0) break;
        }
      } else if (metric.fpPerUnit) {
        points = metric.value * metric.fpPerUnit;
      }
      if (metric.attributes) {
        metric.attributes.forEach(attr => {
          points += (metric.attributeValues[attr.name] || 0) * attr.modifier;
        });
      }
      return total + points;
    }, 0);
  };

  const setDate = (date) => {
    setCurrentDate(date);
  };

  const enterDemoMode = () => {
    setIsDemo(true);
  };

  const exitDemoMode = () => {
    setIsDemo(false);
  };

  const addNewMetric = async (newMetric) => {
    try {
      const userId = isDemo ? 'demoData' : auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No authenticated user found');
      }
      
      // Add default value of 0 to the new metric
      const metricWithDefaultValue = { ...newMetric, value: 0 };
      
      const addedMetric = await addUserMetric(userId, metricWithDefaultValue);
      
      // Update the local state
      setLifeSystemData(prevData => [...prevData, { id: addedMetric.id, ...metricWithDefaultValue }]);

      // Add the new metric to the current daily log
      if (currentLog) {
        const updatedLog = {
          ...currentLog,
          metrics: [...currentLog.metrics, { id: addedMetric.id, ...metricWithDefaultValue }]
        };
        await updateDailyLogs([updatedLog], isDemo);
        setCurrentLog(updatedLog);
        setDailyLogs(prevLogs => prevLogs.map(log => log.id === updatedLog.id ? updatedLog : log));
      }
    } catch (error) {
      console.error("Error adding new metric:", error);
      throw error;
    }
  };

  const contextValue = {
    lifeSystemData,
    setLifeSystemData,
    dailyLogs,
    setDailyLogs,
    isLoading,
    isDemo,
    setIsDemo,
    currentDate,
    currentLog,
    updateMetric,
    addDailyLog,
    calculateFlamePoints,
    setDate,
    enterDemoMode,
    exitDemoMode,
    addNewMetric
  };

  return (
    <LifeSystemContext.Provider
      value={contextValue}
    >
      {children}
    </LifeSystemContext.Provider>
  );
};