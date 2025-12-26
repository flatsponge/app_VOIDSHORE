import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroStep } from './components/IntroStep';
import { FlowDemoStep } from './components/FlowDemoStep';
import { BottleStep } from './components/BottleStep';
import { PassportStep } from './components/PassportStep';
import { TopicsStep } from './components/TopicsStep';
import { TideTimeStep } from './components/TideTimeStep';
import { CommunityStep } from './components/CommunityStep';
import { PaywallStep } from './components/PaywallStep';
import { MainApp } from './components/MainApp';

const App: React.FC = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(prev => prev + 1);

  const steps = [
    // 1. Intro: Emotional Hook (Quiet the noise)
    <IntroStep key="intro" onNext={nextStep} />,
    // 2. Demo: Therapeutic Release (The Science)
    <FlowDemoStep key="demo" onNext={nextStep} />,
    // 3. Bottle: Shared Humanity
    <BottleStep key="bottle" onNext={nextStep} />,
    // 4. Passport: Identity
    <PassportStep key="passport" onNext={nextStep} />,
    // 5. Topics: Personalization
    <TopicsStep key="topics" onNext={nextStep} />,
    // 6. TideTime: Habit Formation
    <TideTimeStep key="tide" onNext={nextStep} />,
    // 7. Community: Social Proof
    <CommunityStep key="community" onNext={nextStep} />,
    // 8. Paywall: Conversion
    <PaywallStep key="paywall" onNext={nextStep} />,
    // 9. App
    <MainApp key="main" />
  ];

  // Variants for the stack effect
  const stackVariants = {
    active: {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 10,
      transition: { 
        duration: 0.8, 
        ease: [0.19, 1, 0.22, 1] 
      }
    },
    history: (custom: number) => ({
      y: -40 * custom, // Move up
      scale: 1 - (0.04 * custom), // Scale down slightly
      opacity: 0, // Fade out completely for cleaner look
      filter: `blur(${10 * custom}px)`, 
      zIndex: 10 - custom,
      transition: { 
        duration: 0.8, 
        ease: [0.19, 1, 0.22, 1] 
      }
    }),
    enter: {
      y: "100%", 
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 20,
      transition: { 
        duration: 0.8, 
        ease: [0.19, 1, 0.22, 1] 
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="w-full h-screen bg-[#09090b] overflow-hidden relative font-sans text-white selection:bg-indigo-500/30">
      <AnimatePresence initial={false} custom={1}>
        {steps.map((component, index) => {
           if (index > step) return null;
           // Keep only the immediate previous step in DOM for transition, but hide it visually via variants
           if (step - index > 1) return null;

           const isCurrent = step === index;
           const diff = step - index;

           return (
            <motion.div
              key={index}
              custom={diff}
              variants={stackVariants}
              initial={isCurrent && step > 0 ? "enter" : "active"} 
              animate={isCurrent ? "active" : "history"}
              exit="exit"
              className="absolute inset-0 w-full h-full bg-[#09090b] will-change-transform shadow-2xl"
              style={{ 
                  zIndex: 10 - diff,
              }}
            >
              {component}
            </motion.div>
           );
        })}
      </AnimatePresence>
      
      {/* Segmented Progress Bar */}
      {step < steps.length - 1 && (
        <div className="absolute top-6 left-6 right-6 flex gap-2 z-50 pointer-events-none">
            {steps.slice(0, steps.length - 1).map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div 
                        initial={false}
                        animate={{ 
                           width: i < step ? "100%" : i === step ? "100%" : "0%",
                           opacity: i <= step ? 1 : 0
                        }}
                        transition={{ duration: i === step ? 4 : 0.3, ease: "linear" }} // Animate current step slowly? No, just fill it.
                        className="h-full bg-white rounded-full" 
                    />
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default App;