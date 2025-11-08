'use client'

import { useState, useEffect } from 'react'

export interface Activity {
  message: string
  icon: string
  time: string
  timestamp: string
}

export function useActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) return
    
    const user = JSON.parse(currentUser)
    const userEmail = user.email
    const activitiesKey = `activities_${userEmail}`
    const storedActivities = JSON.parse(localStorage.getItem(activitiesKey) || '[]')
    
    // Combine activities with welcome message at the end if it exists
    const welcomeActivity = storedActivities.find(a => a.message === 'Welcome to Fun Club Games!')
    const otherActivities = storedActivities.filter(a => a.message !== 'Welcome to Fun Club Games!').slice(0, 9)
    
    const finalActivities = [
      {
        message: 'Welcome to Fun Club Games!',
        icon: 'fa-check-circle',
        time: 'Just now',
        timestamp: new Date().toISOString()
      },
      ...otherActivities
    ]
    
    if (welcomeActivity) {
      finalActivities.push(welcomeActivity)
    }
    
    setActivities(finalActivities.slice(0, 10))
  }, [])

  const saveActivity = (message: string, icon: string = 'fa-info-circle') => {
    if (typeof window === 'undefined') return
    
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) return
    
    const user = JSON.parse(currentUser)
    const userEmail = user.email
    const activitiesKey = `activities_${userEmail}`
    const storedActivities = JSON.parse(localStorage.getItem(activitiesKey) || '[]')
    
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    const newActivity = {
      message,
      icon,
      time: timeString,
      timestamp: now.toISOString()
    }
    
    const updatedActivities = [newActivity, ...storedActivities].slice(0, 20)
    localStorage.setItem(activitiesKey, JSON.stringify(updatedActivities))
    
    // Update the state with the new activity and the stored activities, capped at 10
    const welcomeActivity = updatedActivities.find(a => a.message === 'Welcome to Fun Club Games!')
    const otherActivities = updatedActivities.filter(a => a.message !== 'Welcome to Fun Club Games!').slice(0, 9)
    
    const finalActivities = [newActivity, ...otherActivities]
    if (welcomeActivity && !finalActivities.some(a => a.message === welcomeActivity.message)) {
      finalActivities.push(welcomeActivity)
    }
    
    setActivities(finalActivities.slice(0, 10))
  }

  return { activities, saveActivity }
}

