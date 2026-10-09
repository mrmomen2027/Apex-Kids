/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MISSIONS_DATA, TEACHER_INFO } from './data/curriculumData';
import { Mission, StudentProfile } from './types/curriculum';
import { Header } from './components/Header';
import { MissionNav } from './components/MissionNav';
import { SectionNav, SectionType } from './components/SectionNav';
import { WordsSection } from './components/WordsSection';
import { GrammarSection } from './components/GrammarSection';
import { StorySection } from './components/StorySection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { RegistrationModal } from './components/RegistrationModal';
import { ProfileModal } from './components/ProfileModal';
import { InstallDownloadModal } from './components/InstallDownloadModal';
import { WatermarkBadge } from './components/WatermarkBadge';
import { playSoundEffect } from './utils/audioUtils';

const STORAGE_KEY = 'apex_student_profile_v1';

export default function App() {
  const [missions] = useState<Mission[]>(MISSIONS_DATA);
  const [selectedMissionId, setSelectedMissionId] = useState<number>(1);
  const [currentSection, setCurrentSection] = useState<SectionType>('words');

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isRegModalOpen, setIsRegModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        // First time visitor: show registration modal after a brief delay
        setTimeout(() => {
          setIsRegModalOpen(true);
        }, 500);
      }
    } catch {
      setIsRegModalOpen(true);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  const saveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch {
      // storage quota or disabled
    }
  };

  const handleRegistrationSave = (newProfile: StudentProfile) => {
    saveProfile(newProfile);
    setIsRegModalOpen(false);
  };

  const handleAddStars = (count = 1) => {
    if (!profile) return;
    const updated: StudentProfile = {
      ...profile,
      stars: profile.stars + count,
    };
    saveProfile(updated);
  };

  const handleWordCompleted = (wordId: string) => {
    if (!profile) return;
    if (!profile.completedWords.includes(wordId)) {
      const updated: StudentProfile = {
        ...profile,
        stars: profile.stars + 1,
        completedWords: [...profile.completedWords, wordId],
      };
      saveProfile(updated);
    }
  };

  const handleActivityCompleted = (actId: string) => {
    if (!profile) return;
    if (!profile.completedActivities.includes(actId)) {
      const updated: StudentProfile = {
        ...profile,
        completedActivities: [...profile.completedActivities, actId],
      };
      saveProfile(updated);
    }
  };

  const handleResetProgress = () => {
    if (!profile) return;
    const reset: StudentProfile = {
      ...profile,
      stars: 10,
      completedWords: [],
      completedActivities: [],
    };
    saveProfile(reset);
    setIsProfileModalOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setProfile(null);
    setIsProfileModalOpen(false);
    setIsRegModalOpen(true);
  };

  const currentMission = missions.find(m => m.id === selectedMissionId) || missions[0];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-amber-50/30 to-purple-50/20 text-slate-800">
      {/* Top Main Navigation & Branding */}
      <Header
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        currentMissionNumber={currentMission.missionNumber}
      />

      {/* Mission Selector Carousel (Missions 1 to 10) */}
      <MissionNav
        missions={missions}
        selectedMissionId={selectedMissionId}
        onSelectMission={(id) => {
          setSelectedMissionId(id);
          setCurrentSection('words'); // default to Section 1
        }}
      />

      {/* Section Selector: 4 Bouncy Tabs (Words, Grammar, Story, Activities) */}
      <SectionNav
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        mission={currentMission}
      />

      {/* Section Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 pb-20">
        {currentSection === 'words' && (
          <WordsSection
            mission={currentMission}
            completedWords={profile?.completedWords || []}
            onWordCompleted={handleWordCompleted}
          />
        )}

        {currentSection === 'grammar' && (
          <GrammarSection
            mission={currentMission}
            onStarEarned={() => handleAddStars(1)}
          />
        )}

        {currentSection === 'story' && (
          <StorySection
            mission={currentMission}
            onStoryCompleted={() => handleAddStars(3)}
          />
        )}

        {currentSection === 'activities' && (
          <ActivitiesSection
            mission={currentMission}
            onStarEarned={handleAddStars}
            completedActivities={profile?.completedActivities || []}
            onActivityCompleted={handleActivityCompleted}
            onOpenCertificates={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Teacher Watermark Badge */}
      <WatermarkBadge variant="floating" />

      {/* Footer Branding */}
      <WatermarkBadge variant="footer" />

      {/* Registration Modal (First-time Gmail Sign-in) */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onSave={handleRegistrationSave}
        initialProfile={profile}
        onClose={() => setIsRegModalOpen(false)}
      />

      {/* Student Profile / Star Rewards Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        missions={missions}
        onEditProfile={() => {
          setIsProfileModalOpen(false);
          setIsRegModalOpen(true);
        }}
        onResetProgress={handleResetProgress}
        onLogout={handleLogout}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
        onSelectMission={(missionId) => {
          setSelectedMissionId(missionId);
          setCurrentSection('activities');
          setIsProfileModalOpen(false);
        }}
      />

      {/* App Download / Install Modal */}
      <InstallDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
