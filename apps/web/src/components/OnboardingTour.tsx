'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { CallBackProps, Step } from 'react-joyride';

const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

interface OnboardingTourProps {
  steps: Step[];
  tourKey: string;
  onComplete?: () => void;
}

export default function OnboardingTour({ steps, tourKey, onComplete }: OnboardingTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`tour_${tourKey}`);
    if (!hasSeenTour) {
      const timer = setTimeout(() => setRun(true), 500);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const handleCallback = (data: CallBackProps) => {
    const { status, index, action, type } = data;

    if (type === 'step:after') {
      if (action === 'next') setStepIndex(index + 1);
      else if (action === 'prev') setStepIndex(index - 1);
    }

    if (status === 'finished' || status === 'skipped') {
      setRun(false);
      localStorage.setItem(`tour_${tourKey}`, 'true');
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      spotlightClicks
      spotlightPadding={4}
      callback={handleCallback}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Got it!',
        next: 'Next',
        skip: 'Skip tour',
      }}
      styles={{
        options: {
          primaryColor: '#000000',
          textColor: '#333333',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '9999px',
          padding: '10px 20px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '0.05em',
        },
        buttonBack: {
          color: '#000000',
          marginRight: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '0.05em',
        },
        buttonSkip: {
          color: '#666666',
          fontSize: '12px',
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
        },
        tooltipTitle: {
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        tooltipContent: {
          fontSize: '14px',
          lineHeight: '1.6',
        },
        spotlight: {
          borderRadius: '16px',
        },
      }}
    />
  );
}

export function resetTour(tourKey: string) {
  localStorage.removeItem(`tour_${tourKey}`);
}
