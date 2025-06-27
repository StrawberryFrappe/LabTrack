import { computed } from 'vue'

/**
 * Composable for managing hazard classification styling and variants
 * Centralizes hazard-related styling logic across components
 */
export const useHazardStyles = () => {
  const hazardStyleMap = {
    'non-hazardous': {
      badge: 'bg-green-100 text-green-800',
      variant: 'secondary',
      icon: '✓',
      priority: 1
    },
    'flammable': {
      badge: 'bg-red-100 text-red-800',
      variant: 'warning',
      icon: '🔥',
      priority: 3
    },
    'toxic': {
      badge: 'bg-purple-100 text-purple-800',
      variant: 'destructive',
      icon: '☠️',
      priority: 4
    },
    'carcinogenic': {
      badge: 'bg-pink-100 text-pink-800',
      variant: 'destructive',
      icon: '⚠️',
      priority: 5
    },
    'corrosive': {
      badge: 'bg-orange-100 text-orange-800',
      variant: 'warning',
      icon: '🧪',
      priority: 3
    },
    'oxidizing': {
      badge: 'bg-yellow-100 text-yellow-800',
      variant: 'warning',
      icon: '🔥',
      priority: 3
    },
    'explosive': {
      badge: 'bg-red-200 text-red-900',
      variant: 'destructive',
      icon: '💥',
      priority: 5
    },
    'toxic-flammable': {
      badge: 'bg-red-200 text-red-900',
      variant: 'destructive',
      icon: '☠️🔥',
      priority: 5
    },
    'carcinogenic-flammable': {
      badge: 'bg-pink-200 text-pink-900',
      variant: 'destructive',
      icon: '⚠️🔥',
      priority: 5
    }
  }

  const normalizeHazardClass = (hazardClass) => {
    if (!hazardClass) return 'non-hazardous'
    
    const normalized = hazardClass
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/,/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    // Handle compound hazards
    if (normalized.includes('toxic') && normalized.includes('flammable')) {
      return 'toxic-flammable'
    }
    if (normalized.includes('carcinogenic') && normalized.includes('flammable')) {
      return 'carcinogenic-flammable'
    }
    
    // Find the most severe single hazard
    const hazardTypes = Object.keys(hazardStyleMap)
    const matchingHazards = hazardTypes.filter(type => 
      normalized.includes(type.replace('-', ''))
    )
    
    if (matchingHazards.length === 0) {
      return 'non-hazardous'
    }
    
    // Return the most severe hazard (highest priority)
    return matchingHazards.reduce((prev, current) => 
      hazardStyleMap[current].priority > hazardStyleMap[prev].priority ? current : prev
    )
  }

  const getHazardStyle = (hazardClass) => {
    const normalized = normalizeHazardClass(hazardClass)
    return hazardStyleMap[normalized] || hazardStyleMap['non-hazardous']
  }

  const getHazardBadgeClasses = (hazardClass) => {
    return getHazardStyle(hazardClass).badge
  }

  const getHazardVariant = (hazardClass) => {
    return getHazardStyle(hazardClass).variant
  }

  const getHazardIcon = (hazardClass) => {
    return getHazardStyle(hazardClass).icon
  }

  const getHazardPriority = (hazardClass) => {
    return getHazardStyle(hazardClass).priority
  }

  // Legacy compatibility function for existing components
  const getHazardClasses = (hazardClass) => {
    return getHazardBadgeClasses(hazardClass)
  }

  return {
    getHazardStyle,
    getHazardBadgeClasses,
    getHazardVariant,
    getHazardIcon,
    getHazardPriority,
    getHazardClasses, // Legacy compatibility
    normalizeHazardClass
  }
}
