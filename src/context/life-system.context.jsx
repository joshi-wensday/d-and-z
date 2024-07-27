// src/context/life-system.context.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../utils/firebase/firebase.utils';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from './auth.context';

export const LifeSystemContext = createContext();

const sampleConversionRules = [
    { id: 1, category: 'Life', metric: 'Woman approached', conversionRule: '2FP per approach', fpPerUnit: 2 },
    { id: 2, category: 'Life', metric: 'Friends seen', conversionRule: '1FP per friend', fpPerUnit: 1 },
    { id: 3, category: 'Dreams', metric: 'Dream work sessions', conversionRule: '1FP per 25 minutes', fpPerUnit: 1 },
    { id: 4, category: 'Space', metric: 'Meditation', conversionRule: '0.2FP per minute', fpPerUnit: 0.2 },
    { id: 5, category: 'Vita', metric: 'Strength training reps', conversionRule: '1FP per rep', fpPerUnit: 1 },
  ];
  
const sampleHabits = [
    { id: 1, category: 'Life', name: 'Woman approached', value: 0 },
    { id: 2, category: 'Life', name: 'Friends seen', value: 0 },
    { id: 3, category: 'Dreams', name: 'Dream work sessions', value: 0 },
    { id: 4, category: 'Space', name: 'Meditation', value: 0 },
    { id: 5, category: 'Vita', name: 'Strength training reps', value: 0 },
  ];

const sampleDailyLogs = [
    {
        date: '2024-07-21',
        'Woman approached': 2,
        'Friends seen': 3,
        'Dream work sessions': 1,
        'Meditation (minutes)': 15,
        'Strength training reps': 20,
        'Creative projects worked on': 1,
        'Hours spent on hobbies': 2
    },
    {
        date: '2024-07-22',
        'Woman approached': 1,
        'Friends seen': 2,
        'Dream work sessions': 2,
        'Meditation (minutes)': 20,
        'Strength training reps': 25,
        'Creative projects worked on': 0,
        'Hours spent on hobbies': 1
    },
    {
        date: '2024-07-23',
        'Woman approached': 3,
        'Friends seen': 1,
        'Dream work sessions': 1,
        'Meditation (minutes)': 10,
        'Strength training reps': 15,
        'Creative projects worked on': 1,
        'Hours spent on hobbies': 3
    },
    {
        date: '2024-07-24',
        'Woman approached': 0,
        'Friends seen': 4,
        'Dream work sessions': 3,
        'Meditation (minutes)': 30,
        'Strength training reps': 30,
        'Creative projects worked on': 2,
        'Hours spent on hobbies': 2
    },
    {
        date: '2024-07-25',
        'Woman approached': 2,
        'Friends seen': 2,
        'Dream work sessions': 2,
        'Meditation (minutes)': 25,
        'Strength training reps': 20,
        'Creative projects worked on': 1,
        'Hours spent on hobbies': 1
    },
    {
        date: '2024-07-26',
        'Woman approached': 1,
        'Friends seen': 3,
        'Dream work sessions': 1,
        'Meditation (minutes)': 15,
        'Strength training reps': 25,
        'Creative projects worked on': 0,
        'Hours spent on hobbies': 2
    },
    {
        date: '2024-07-27',
        'Woman approached': 2,
        'Friends seen': 2,
        'Dream work sessions': 2,
        'Meditation (minutes)': 20,
        'Strength training reps': 20,
        'Creative projects worked on': 1,
        'Hours spent on hobbies': 3
    }
    ];

export const LifeSystemProvider = ({ children }) => {
    const [habits, setHabits] = useState(sampleHabits);
    const [dailyLogs, setDailyLogs] = useState(sampleDailyLogs);
    const [conversionRules, setConversionRules] = useState(sampleConversionRules);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const { user } = useContext(AuthContext);
    const [isDemo, setIsDemo] = useState(!user);
  
    useEffect(() => {
      if (user) {
        // Fetch real data from Firestore
        const fetchData = async () => {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setHabits(userData.habits || sampleHabits);
            setDailyLogs(userData.dailyLogs || sampleDailyLogs);
            setConversionRules(userData.conversionRules || []);
          } else {
            // If it's a new user, initialize with sample data
            await setDoc(userDocRef, { habits: sampleHabits, dailyLogs: sampleDailyLogs, conversionRules: [] });
            setHabits(sampleHabits);
            setDailyLogs(sampleDailyLogs);
          }
        };
  
        fetchData();
        setIsDemo(false);
      } else {
        // Use sample data for demo mode
        setHabits(sampleHabits);
        setDailyLogs(sampleDailyLogs);
        setIsDemo(true);
      }
    }, [user]);

    useEffect(() => {
        // Link habits with conversion rules
        const linkedHabits = habits.map(habit => {
          const rule = conversionRules.find(r => r.metric === habit.name);
          return { ...habit, fpPerUnit: rule ? rule.fpPerUnit : 0 };
        });
        setHabits(linkedHabits);
      }, [conversionRules]);
  
    const updateHabit = (id, newValue) => {
      const updatedHabits = habits.map(habit => 
        habit.id === id ? { ...habit, value: parseInt(newValue) || 0 } : habit
      );
      setHabits(updatedHabits);

      // Update the daily log for the current date
      const updatedDailyLogs = dailyLogs.map(log => {
        if (log.date === currentDate) {
          const updatedLog = { ...log };
          updatedHabits.forEach(habit => {
            updatedLog[habit.name] = habit.value;
          });
          return updatedLog;
        }
        return log;
      });

      setDailyLogs(updatedDailyLogs);

      if (user && !isDemo) {
        // Update Firestore here
      }
    };

    const updateConversionRule = (id, updatedRule) => {
        const updatedRules = conversionRules.map(rule => 
          rule.id === id ? { ...rule, ...updatedRule } : rule
        );
        setConversionRules(updatedRules);
    
        if (user && !isDemo) {
          // Update Firestore here (when we implement it)
        }
      };

    const setDate = (date) => {
      setCurrentDate(date);
      const currentLog = dailyLogs.find(log => log.date === date);
      if (currentLog) {
        const updatedHabits = habits.map(habit => ({
          ...habit,
          value: currentLog[habit.name] || 0
        }));
        setHabits(updatedHabits);
      } else {
        setHabits(habits.map(habit => ({ ...habit, value: 0 })));
      }
    };

    const calculateFlamePoints = (log) => {
        return habits.reduce((total, habit) => {
          const value = log[habit.name] || 0;
          return total + value * habit.fpPerUnit;
        }, 0);
      };
    
      return (
        <LifeSystemContext.Provider value={{ 
          habits, 
          updateHabit, 
          dailyLogs, 
          conversionRules,
          updateConversionRule, 
          isDemo, 
          setIsDemo, 
          currentDate, 
          setDate: setCurrentDate,
          calculateFlamePoints
        }}>
          {children}
        </LifeSystemContext.Provider>
      );
    };