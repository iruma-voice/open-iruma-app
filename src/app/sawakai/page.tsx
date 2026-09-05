import HeroSection from '@/components/sawakai/lp/HeroSection';
import ProblemSection from '@/components/sawakai/lp/ProblemSection';
import ExperienceSection from '@/components/sawakai/lp/ExperienceSection';
import RulesSection from '@/components/sawakai/lp/RulesSection';
import ClosingSection from '@/components/sawakai/lp/ClosingSection';
import FloatingCTA from '@/components/sawakai/lp/FloatingCTA';

export const metadata = {
  title: 'いるまモヤモヤ茶話会',
  description: '日常の「モヤモヤ」を、公共のアジェンダへ。AIファシリテーターと事前チャットで対話し、あなたの声を形にする新しい市民参加のカタチ。',
};

export default function SawakaiLP() {
  return (
    <main className="bg-white min-h-screen relative selection:bg-emerald-200 selection:text-emerald-900">
      <HeroSection />
      <ProblemSection />
      <ExperienceSection />
      <RulesSection />
      <ClosingSection />
      
      <FloatingCTA />
    </main>
  );
}
