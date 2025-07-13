import { Athlete, TalentVideo, Scout, ScoutingReport, AIVideoAnalysis } from '../types';

export const mockAthletes: Athlete[] = [
  {
    id: '1',
    userId: 'athlete1',
    name: 'Marcus Silva',
    age: 18,
    position: 'Attacking Midfielder',
    sport: 'Football',
    location: 'São Paulo, Brazil',
    avatar: '⚽',
    bio: 'Creative midfielder with exceptional vision and technical ability. Dreams of playing in Europe.',
    height: '5\'8"',
    weight: '150 lbs',
    preferredFoot: 'right',
    experience: '10 years',
    achievements: [
      'São Paulo Youth League Top Scorer 2023',
      'Brazil U-18 National Team Call-up',
      'Best Young Player - Regional Championship'
    ],
    contactInfo: {
      email: 'marcus.silva@email.com',
      phone: '+55 11 99999-9999',
      agent: 'Carlos Rodriguez Sports Management'
    },
    socialMedia: {
      instagram: '@marcussilva10',
      twitter: '@msilva_football'
    },
    stats: {
      gamesPlayed: 45,
      goals: 23,
      assists: 18,
      passAccuracy: 87,
      shotsOnTarget: 68,
      minutesPlayed: 3420,
      yellowCards: 3,
      redCards: 0,
      seasonStats: [
        {
          season: '2023',
          competition: 'São Paulo Youth League',
          appearances: 22,
          goals: 15,
          assists: 12,
          averageRating: 8.2
        }
      ]
    },
    videos: [],
    scoutingReports: [],
    isVerified: true,
    joinedAt: new Date('2024-01-15'),
    lastActive: new Date()
  },
  {
    id: '2',
    userId: 'athlete2',
    name: 'Emma Thompson',
    age: 17,
    position: 'Center Back',
    sport: 'Football',
    location: 'Manchester, England',
    avatar: '🛡️',
    bio: 'Commanding center-back with excellent aerial ability and leadership qualities.',
    height: '5\'10"',
    weight: '140 lbs',
    preferredFoot: 'left',
    experience: '8 years',
    achievements: [
      'England U-17 Captain',
      'Manchester Academy Player of the Year',
      'Clean Sheet Record Holder'
    ],
    contactInfo: {
      email: 'emma.thompson@email.com',
      phone: '+44 7700 900123'
    },
    socialMedia: {
      instagram: '@emmathompson_fb',
      tiktok: '@emmafootball'
    },
    stats: {
      gamesPlayed: 38,
      goals: 8,
      assists: 5,
      tackles: 156,
      passAccuracy: 91,
      minutesPlayed: 3240,
      yellowCards: 2,
      redCards: 0,
      seasonStats: [
        {
          season: '2023',
          competition: 'FA Youth Cup',
          appearances: 18,
          goals: 4,
          assists: 3,
          averageRating: 8.5
        }
      ]
    },
    videos: [],
    scoutingReports: [],
    isVerified: true,
    joinedAt: new Date('2024-02-01'),
    lastActive: new Date()
  },
  {
    id: '3',
    userId: 'athlete3',
    name: 'Kai Nakamura',
    age: 19,
    position: 'Goalkeeper',
    sport: 'Football',
    location: 'Tokyo, Japan',
    avatar: '🥅',
    bio: 'Agile goalkeeper with exceptional reflexes and distribution. Studying sports science.',
    height: '6\'2"',
    weight: '175 lbs',
    experience: '12 years',
    achievements: [
      'J-League Youth Best Goalkeeper 2023',
      'Japan U-19 National Team',
      'University Championship Winner'
    ],
    contactInfo: {
      email: 'kai.nakamura@email.com',
      phone: '+81 90-1234-5678'
    },
    socialMedia: {
      instagram: '@kai_gk',
      twitter: '@nakamura_saves'
    },
    stats: {
      gamesPlayed: 32,
      saves: 187,
      goals: 0,
      assists: 8,
      minutesPlayed: 2880,
      yellowCards: 1,
      redCards: 0,
      seasonStats: [
        {
          season: '2023',
          competition: 'J-League Youth',
          appearances: 20,
          goals: 0,
          assists: 5,
          averageRating: 8.7
        }
      ]
    },
    videos: [],
    scoutingReports: [],
    isVerified: true,
    joinedAt: new Date('2024-01-20'),
    lastActive: new Date()
  }
];

export const mockTalentVideos: TalentVideo[] = [
  {
    id: '1',
    athleteId: '1',
    title: 'Incredible Solo Goal vs Rivals',
    description: 'Beat 4 defenders and scored with a curled shot into the top corner',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: 45,
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 15420,
    likes: 2340,
    saves: 456,
    comments: [],
    tags: ['goal', 'dribbling', 'technique'],
    skillsShowcased: ['Dribbling', 'Shooting', 'Ball Control'],
    isHighlight: true,
    gameContext: {
      opponent: 'Corinthians Youth',
      date: new Date('2024-01-15'),
      competition: 'São Paulo Youth League',
      result: '3-1 Win'
    }
  },
  {
    id: '2',
    athleteId: '2',
    title: 'Defensive Masterclass',
    description: 'Perfect timing on tackles and aerial duels throughout the match',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: 60,
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    views: 8930,
    likes: 1240,
    saves: 234,
    comments: [],
    tags: ['defending', 'headers', 'leadership'],
    skillsShowcased: ['Defending', 'Heading', 'Leadership'],
    isHighlight: true,
    gameContext: {
      opponent: 'Liverpool Academy',
      date: new Date('2024-01-20'),
      competition: 'FA Youth Cup',
      result: '2-0 Win'
    }
  },
  {
    id: '3',
    athleteId: '3',
    title: 'Incredible Reflex Saves',
    description: 'Series of world-class saves including a penalty stop',
    videoUrl: 'https://example.com/video3.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: 38,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    views: 12650,
    likes: 1890,
    saves: 378,
    comments: [],
    tags: ['saves', 'reflexes', 'penalty'],
    skillsShowcased: ['Shot Stopping', 'Reflexes', 'Positioning'],
    isHighlight: true,
    gameContext: {
      opponent: 'Osaka FC Youth',
      date: new Date('2024-01-18'),
      competition: 'J-League Youth',
      result: '1-0 Win'
    }
  }
];

export const mockAIAnalysis: AIVideoAnalysis[] = [
  {
    id: '1',
    videoId: '1',
    overallRating: 87,
    technicalSkills: {
      ballControl: 92,
      passing: 85,
      shooting: 89,
      dribbling: 94,
      defending: 45,
      heading: 65,
      pace: 78,
      agility: 88
    },
    physicalAttributes: {
      speed: 82,
      strength: 68,
      endurance: 75,
      balance: 90,
      coordination: 91
    },
    mentalAttributes: {
      decisionMaking: 84,
      awareness: 87,
      composure: 89,
      leadership: 72,
      workRate: 86
    },
    keyStrengths: [
      'Exceptional close ball control in tight spaces',
      'Creative passing and vision',
      'Ability to beat multiple defenders',
      'Composed finishing under pressure'
    ],
    areasForImprovement: [
      'Defensive contribution and work rate',
      'Physical strength and aerial ability',
      'Consistency in final third decision making'
    ],
    comparisonPlayers: ['Bernardo Silva', 'David Silva', 'Riyad Mahrez'],
    potentialRating: 91,
    confidenceScore: 94,
    analysisDate: new Date(),
    detailedInsights: 'Marcus demonstrates exceptional technical ability with outstanding ball control and dribbling skills. His vision and creativity in the final third are well above average for his age group. The ability to maintain composure under pressure and execute precise finishes suggests high potential for professional football. Areas for development include physical conditioning and defensive responsibilities.'
  }
];

export const mockScouts: Scout[] = [
  {
    id: '1',
    name: 'Roberto Martinez',
    organization: 'FC Barcelona Academy',
    position: 'Head Scout - South America',
    avatar: '🔍',
    bio: 'Experienced scout specializing in South American talent with 15 years in professional football.',
    specializations: ['Technical Players', 'Youth Development', 'South American Markets'],
    experience: 15,
    location: 'Barcelona, Spain',
    contactInfo: {
      email: 'r.martinez@fcbarcelona.com',
      phone: '+34 600 123 456'
    },
    preferences: {
      sports: ['Football'],
      positions: ['Attacking Midfielder', 'Winger', 'Forward'],
      ageRange: { min: 16, max: 21 },
      locations: ['Brazil', 'Argentina', 'Colombia', 'Uruguay'],
      skillPriorities: {
        technical: 90,
        physical: 60,
        mental: 80
      },
      minimumRating: 75
    },
    watchlist: ['1', '2'],
    recentActivity: [
      {
        id: '1',
        type: 'viewed',
        athleteId: '1',
        athleteName: 'Marcus Silva',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        details: 'Watched highlight reel'
      }
    ],
    joinedAt: new Date('2023-06-01')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    organization: 'Manchester United Women',
    position: 'Youth Scout',
    avatar: '⚽',
    bio: 'Former professional player turned scout, focusing on women\'s football talent development.',
    specializations: ['Women\'s Football', 'Defensive Players', 'Leadership Qualities'],
    experience: 8,
    location: 'Manchester, England',
    contactInfo: {
      email: 's.johnson@manutd.com',
      phone: '+44 7700 900456'
    },
    preferences: {
      sports: ['Football'],
      positions: ['Center Back', 'Defensive Midfielder', 'Full Back'],
      ageRange: { min: 15, max: 20 },
      locations: ['England', 'Scotland', 'Wales', 'Ireland'],
      skillPriorities: {
        technical: 70,
        physical: 85,
        mental: 90
      },
      minimumRating: 70
    },
    watchlist: ['2'],
    recentActivity: [
      {
        id: '2',
        type: 'saved',
        athleteId: '2',
        athleteName: 'Emma Thompson',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        details: 'Added to priority watchlist'
      }
    ],
    joinedAt: new Date('2023-09-15')
  }
];

export const mockScoutingReports: ScoutingReport[] = [
  {
    id: '1',
    athleteId: '1',
    scoutId: 'ai-system',
    scoutName: 'TalentFlow AI',
    scoutOrganization: 'AI Analysis System',
    overallRating: 87,
    technicalRating: 90,
    physicalRating: 75,
    mentalRating: 85,
    potential: 91,
    strengths: [
      'Exceptional ball control and first touch',
      'Creative passing and vision',
      'Composed under pressure',
      'Natural goal-scoring instinct'
    ],
    weaknesses: [
      'Needs to improve defensive work rate',
      'Physical strength could be enhanced',
      'Consistency in big matches'
    ],
    recommendation: 'sign',
    notes: 'Outstanding technical ability with high potential. Recommend immediate academy placement with focus on physical development and tactical awareness.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isAIGenerated: true
  }
];