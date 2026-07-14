import React from 'react';
import { Composition } from 'remotion';
import { HookHumanComposition } from './compositions/HookHuman.jsx';
import { ChecklistComposition } from './compositions/Checklist.jsx';
import { ProblemPersonComposition } from './compositions/ProblemPerson.jsx';
import { PremiumOpsComposition } from './compositions/PremiumOps.jsx';
import { MeetTeammateComposition } from './compositions/MeetTeammate.jsx';
import { RealWorkdayComposition } from './compositions/RealWorkday.jsx';
import { OverloadSupportComposition } from './compositions/OverloadSupport.jsx';
import { VerticalPracticeComposition } from './compositions/VerticalPractice.jsx';
import { MOTION_DEFAULTS } from './data/motionDefaults.js';
import { VIDEO_DEFAULTS } from './data/videoDefaults.js';

const byId = Object.fromEntries(MOTION_DEFAULTS.map((m) => [m.compositionId, m]));
const videoById = Object.fromEntries(VIDEO_DEFAULTS.map((m) => [m.compositionId, m]));

function propsFrom(id) {
  const m = byId[id] || {};
  return {
    headline: m.headline,
    headlineTwo: m.headlineTwo,
    support: m.support,
    bullets: m.bullets,
    cards: m.cards,
    cta: m.cta,
    imageSrc: m.imageSrc,
    candidateName: m.candidateName,
    role: m.role,
    animationIntensity: m.animationIntensity || 'standard',
    showSafeZones: false,
  };
}

function videoProps(id) {
  const m = videoById[id] || {};
  return { ...m, showSafeZones: false };
}

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MV-HOOK-HUMAN-01"
        component={HookHumanComposition}
        durationInFrames={byId['MV-HOOK-HUMAN-01']?.durationInFrames || 330}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propsFrom('MV-HOOK-HUMAN-01')}
      />
      <Composition
        id="MV-CHECKLIST-01"
        component={ChecklistComposition}
        durationInFrames={byId['MV-CHECKLIST-01']?.durationInFrames || 300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propsFrom('MV-CHECKLIST-01')}
      />
      <Composition
        id="MV-PROBLEM-PERSON-01"
        component={ProblemPersonComposition}
        durationInFrames={byId['MV-PROBLEM-PERSON-01']?.durationInFrames || 390}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propsFrom('MV-PROBLEM-PERSON-01')}
      />
      <Composition
        id="MV-PREMIUM-OPS-01"
        component={PremiumOpsComposition}
        durationInFrames={byId['MV-PREMIUM-OPS-01']?.durationInFrames || 360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propsFrom('MV-PREMIUM-OPS-01')}
      />

      <Composition
        id="MV-MEET-TEAMMATE-01"
        component={MeetTeammateComposition}
        durationInFrames={videoById['MV-MEET-TEAMMATE-01']?.durationInFrames || 360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={videoProps('MV-MEET-TEAMMATE-01')}
      />
      <Composition
        id="MV-REAL-WORKDAY-01"
        component={RealWorkdayComposition}
        durationInFrames={videoById['MV-REAL-WORKDAY-01']?.durationInFrames || 360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={videoProps('MV-REAL-WORKDAY-01')}
      />
      <Composition
        id="MV-OVERLOAD-SUPPORT-01"
        component={OverloadSupportComposition}
        durationInFrames={videoById['MV-OVERLOAD-SUPPORT-01']?.durationInFrames || 330}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={videoProps('MV-OVERLOAD-SUPPORT-01')}
      />
      <Composition
        id="MV-VERTICAL-PRACTICE-01"
        component={VerticalPracticeComposition}
        durationInFrames={videoById['MV-VERTICAL-PRACTICE-01']?.durationInFrames || 360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={videoProps('MV-VERTICAL-PRACTICE-01')}
      />
    </>
  );
};
