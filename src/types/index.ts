// User Registration Types (matching smart contract)
export enum UserRole {
  None = 0,
  Athlete = 1,
  Scout = 2
}

export interface AthleteProfile {
  name: string;
  age: number;
  sport: string;
  position: string;
  bio: string;
  avatar?: string;
}

export interface ScoutProfile {
  name: string;
  organization: string;
  position: string;
  avatar?: string;
}

export interface UserRegistrationState {
  userRole: UserRole;
  isOnboarded: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Athlete {
  id: string;
  userId: string;
  name: string;
  age: number;
  position: string;
  sport: string;
  location: string;
  avatar?: string;
  bio: string;
  height: string;
  weight: string;
  preferredFoot?: 'left' | 'right' | 'both';
  experience: string;
  achievements: string[];
  contactInfo: {
    email: string;
    phone?: string;
    agent?: string;
  };
  socialMedia: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  stats: AthleteStats;
  videos: TalentVideo[];
  scoutingReports: ScoutingReport[];
  isVerified: boolean;
  joinedAt: Date;
  lastActive: Date;
}

export interface TalentVideo {
  id: string;
  athleteId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  uploadedAt: Date;
  views: number;
  likes: number;
  saves: number;
  comments: VideoComment[];
  tags: string[];
  skillsShowcased: string[];
  aiAnalysis?: AIVideoAnalysis;
  isHighlight: boolean;
  gameContext?: {
    opponent: string;
    date: Date;
    competition: string;
    result: string;
  };
}

export interface AIVideoAnalysis {
  id: string;
  videoId: string;
  overallRating: number; // 1-100
  technicalSkills: {
    ballControl: number;
    passing: number;
    shooting: number;
    dribbling: number;
    defending: number;
    heading: number;
    pace: number;
    agility: number;
  };
  physicalAttributes: {
    speed: number;
    strength: number;
    endurance: number;
    balance: number;
    coordination: number;
  };
  mentalAttributes: {
    decisionMaking: number;
    awareness: number;
    composure: number;
    leadership: number;
    workRate: number;
  };
  keyStrengths: string[];
  areasForImprovement: string[];
  comparisonPlayers: string[];
  potentialRating: number;
  confidenceScore: number;
  analysisDate: Date;
  detailedInsights: string;
}

export interface ScoutingReport {
  id: string;
  athleteId: string;
  scoutId: string;
  scoutName: string;
  scoutOrganization: string;
  overallRating: number;
  technicalRating: number;
  physicalRating: number;
  mentalRating: number;
  potential: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'sign' | 'monitor' | 'pass';
  notes: string;
  createdAt: Date;
  isAIGenerated: boolean;
}

export interface AthleteStats {
  gamesPlayed: number;
  goals?: number;
  assists?: number;
  saves?: number;
  tackles?: number;
  passAccuracy?: number;
  shotsOnTarget?: number;
  minutesPlayed: number;
  yellowCards?: number;
  redCards?: number;
  seasonStats: SeasonStats[];
}

export interface SeasonStats {
  season: string;
  competition: string;
  appearances: number;
  goals?: number;
  assists?: number;
  averageRating: number;
}

export interface Scout {
  id: string;
  name: string;
  organization: string;
  position: string;
  avatar?: string;
  bio: string;
  specializations: string[];
  experience: number;
  location: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
  preferences: ScoutPreferences;
  watchlist: string[]; // athlete IDs
  recentActivity: ScoutActivity[];
  joinedAt: Date;
}

export interface ScoutPreferences {
  sports: string[];
  positions: string[];
  ageRange: {
    min: number;
    max: number;
  };
  locations: string[];
  skillPriorities: {
    technical: number;
    physical: number;
    mental: number;
  };
  minimumRating: number;
}

export interface ScoutActivity {
  id: string;
  type: 'viewed' | 'saved' | 'contacted' | 'reported';
  athleteId: string;
  athleteName: string;
  timestamp: Date;
  details?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  userType: 'athlete' | 'scout' | 'fan';
  content: string;
  timestamp: number; // video timestamp in seconds
  createdAt: Date;
  likes: number;
  replies: VideoComment[];
}

export interface TalentFeed {
  id: string;
  videos: TalentVideo[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface SearchFilters {
  sport?: string;
  position?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  location?: string;
  minRating?: number;
  skills?: string[];
  sortBy: 'trending' | 'newest' | 'rating' | 'potential';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'scout_interest' | 'video_liked' | 'new_report' | 'message' | 'achievement';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string;
  unlockedAt?: Date;
}

export interface TryoutEvent {
  id: string;
  organizerId: string;
  organizerName: string;
  title: string;
  description: string;
  sport: string;
  positions: string[];
  location: string;
  date: Date;
  duration: number; // in hours
  maxParticipants: number;
  currentParticipants: number;
  requirements: string[];
  contactInfo: string;
  registrationDeadline: Date;
  isPublic: boolean;
  createdAt: Date;
}