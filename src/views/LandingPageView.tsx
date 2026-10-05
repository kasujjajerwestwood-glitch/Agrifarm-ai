import React from 'react';
import {
  Sprout,
  Camera,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  CloudRain,
  Eye,
  FileText,
} from 'lucide-react';

interface LandingPageViewProps {
  onScanNow: () => void;
  onGetStarted: () => void;
  onExploreFeatures: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onScanNow,
  onGetStarted,
  onExploreFeatures,
}) => {
  const steps = [
    {
      num: '1',
      title: 'Capture',
      desc: 'Photograph your infected crop leaf, whole plant, and underside using smart on-screen photo guidance.',
      icon: Camera,
    },
    {
      num: '2',
      title: 'Analyze',
      desc: 'Gemini multimodal vision inspects lesion margins, chlorosis patterns, and fungal spore signs in seconds.',
      icon: Sparkles,
    },
    {
      num: '3',
      title: 'Understand',
      desc: 'Receive a structured pathology report detailing observed symptoms, probable pathogens, and confidence level.',
      icon: Eye,
    },
    {
      num: '4',
      title: 'Act',
      desc: 'Implement recommended cultural, organic, or targeted chemical treatments with strict safety intervals.',
      icon: CheckCircle2,
    },
    {
      num: '5',
      title: 'Monitor',
      desc: 'Track field recovery over time, log farm activities, and connect future soil moisture and smart irrigation sensors.',
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 opacity-10 pointer-events-none">
          <Sprout className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-emerald-300 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Smart Farming. Better Decisions. Healthier Crops.</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight flex items-center space-x-3 flex-wrap">
            <span>AGRIFARM UGANDA</span>
            <span className="text-3xl sm:text-5xl">🇺🇬</span>
          </h1>

          <p className="text-emerald-100 text-base sm:text-xl font-normal leading-relaxed max-w-2xl">
            AI-powered crop health monitoring and smart farm management designed for Ugandan smallholder and commercial farmers, extension officers, and agricultural students.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onScanNow}
              className="flex items-center space-x-2.5 px-6 py-4 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-stone-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/30 transition-all transform active:scale-95"
            >
              <Camera className="w-5 h-5 text-stone-950 stroke-[2.5]" />
              <span>Scan a Plant</span>
            </button>

            <button
              onClick={onGetStarted}
              className="flex items-center space-x-2 px-6 py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base rounded-2xl backdrop-blur-sm border border-white/20 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="px-5 py-4 text-emerald-200 hover:text-white font-semibold text-sm transition-colors"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
            How The Platform Works
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
            From Field Symptom to Practical Harvest Security
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            A continuous closed-loop workflow that keeps your crops vigorous throughout every growing stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-heading font-extrabold text-sm">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-stone-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Showcase */}
      <section id="features-section" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
            Engineered For Agriculture
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
            Everything A Smart Farmer Needs In One Place
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: AI Plant Scanner */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              AI Plant Scanner
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Upload multiple angles with on-screen photo guidance. Gemini vision calculates disease confidence, observed symptoms, and biological controls.
            </p>
          </div>

          {/* Feature 2: Smart Farm Management */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Digital Farm Management
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Organize multi-hectare farms into blocks. Classify soil types, irrigation methods, and trace crop varieties from planting to harvest.
            </p>
          </div>

          {/* Feature 3: AgriFarm Uganda AI Assistant */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              AgriFarm Uganda AI Agronomist
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Ask deep questions about soil nutrition, compost tea recipes, spray intervals, and field troubleshooting. Attach images directly into the chat.
            </p>
          </div>

          {/* Feature 4: Crop Monitoring */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Crop Health Overview
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Informational health scores synthesized from recent scout reports, disease occurrence logs, and root zone moisture data.
            </p>
          </div>

          {/* Feature 5: Smart Alerts */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Proactive Farm Alerts
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Receive notifications for upcoming rainfall, high fungal humidity risk, irrigation timing reminders, and pest scouting windows.
            </p>
          </div>

          {/* Feature 6: IoT & Smart Irrigation */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Future IoT & Solenoid Control
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Standardized JSON architecture for ESP32 and Arduino soil sensors, ultrasonic tank level monitors, and automated drip pumps.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl">
          Ready to diagnose your crops with AI?
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mx-auto">
          Take your first plant photo now or explore the sample demo fields with zero setup required.
        </p>
        <div className="pt-2">
          <button
            onClick={onScanNow}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
          >
            Launch AI Plant Scanner
          </button>
        </div>
      </section>
    </div>
  );
};
