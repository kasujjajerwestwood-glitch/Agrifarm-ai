import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sun,
  Eye,
  FileText,
  Sparkles,
  X,
  Plus,
  ShieldCheck,
  Printer,
  Info,
  ChevronRight,
  Focus,
  Moon,
  Leaf,
  Bug,
  BookOpen,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Crop, Field, PlantScan, PlantScanAnalysis, Language } from '../types';
import { ApiService } from '../services/apiService';
import { sampleScannerTestImages } from '../data/mockInitialData';
import { useImageValidation, ImageValidationResult } from '../hooks/useImageValidation';
import { CameraPermissionModal } from '../components/modals/CameraPermissionModal';
import { t } from '../services/i18n';

interface ScannerViewProps {
  crops: Crop[];
  fields: Field[];
  onSaveScan: (scan: PlantScan) => void;
  onConsultAI: (context: { cropName: string; issue: string; imageBase64?: string }) => void;
  lang: Language;
  initialScan?: PlantScan | null;
}

interface ImageSlot {
  id: string;
  label: string;
  benefit: string;
  dataUrl?: string;
  validation?: ImageValidationResult;
  isAnalyzingQuality?: boolean;
  ignoredWarning?: boolean;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  crops,
  fields,
  onSaveScan,
  onConsultAI,
  lang,
  initialScan,
}) => {
  // Pre-configured slots with diagnostic benefits
  const [photoSlots, setPhotoSlots] = useState<ImageSlot[]>([
    {
      id: 'affected_leaf',
      label: 'Affected Leaf (Primary)',
      benefit: 'Crucial for detecting fungal lesions, leaf spots, chlorosis, and nutrient deficiency colors.',
      dataUrl: undefined,
    },
    {
      id: 'whole_plant',
      label: 'Whole Plant View',
      benefit: 'Helps determine if wilting is systemic or localized to lower or upper leaves.',
      dataUrl: undefined,
    },
    {
      id: 'macro_closeup',
      label: 'Close-Up of Symptom',
      benefit: 'Reveals concentric rings, fungal spores, or bacterial margins.',
      dataUrl: undefined,
    },
    {
      id: 'leaf_underside',
      label: 'Leaf Underside',
      benefit: 'Pests (aphids, mites, whiteflies) and downy mildew hide underneath.',
      dataUrl: undefined,
    },
  ]);

  const [activeSlotId, setActiveSlotId] = useState<string>('affected_leaf');
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [cropStage, setCropStage] = useState<string>('Vegetative Growth');
  const [fieldId, setFieldId] = useState<string>(fields[0]?.id || '');
  const [locationNotes, setLocationNotes] = useState<string>('Plot 1');
  const [symptoms, setSymptoms] = useState<string>('');
  const [selectedSymptomTags, setSelectedSymptomTags] = useState<string[]>([]);

  // Validation hook
  const { validateImage } = useImageValidation();
  const [validationModalSlot, setValidationModalSlot] = useState<ImageSlot | null>(null);

  // Scanning process states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PlantScanAnalysis | null>(
    initialScan ? initialScan.analysis : null
  );
  const [activeScanId, setActiveScanId] = useState<string | null>(initialScan ? initialScan.id : null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPhotoTips, setShowPhotoTips] = useState(true);
  const [isCameraGuideModalOpen, setIsCameraGuideModalOpen] = useState(false);

  // File input refs for separate camera vs upload gallery actions
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const scanSteps = [
    { label: 'Examining image & visual features', desc: 'Analyzing leaf texture, color variations, and margins' },
    { label: 'Identifying visible symptoms', desc: 'Detecting necrosis, chlorosis, lesions, or insect damage' },
    { label: 'Checking crop information', desc: `Matching ${selectedCrop} growth stage and tropical biology` },
    { label: 'Comparing agricultural knowledge', desc: 'Querying CABI Plantwise, FAO, and diagnostic reference keys' },
    { label: 'Preparing recommendations', desc: 'Synthesizing organic and agronomic management advice' },
  ];

  const commonSymptomChips = [
    'Yellowing leaves',
    'Brown/black spots',
    'Wilting/drooping',
    'White powder/mildew',
    'Holes in leaves',
    'Curling leaves',
    'Stunted growth',
    'Insects visible',
  ];

  const toggleSymptomTag = (tag: string) => {
    setSelectedSymptomTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      setPhotoSlots((prev) =>
        prev.map((slot) =>
          slot.id === activeSlotId
            ? { ...slot, dataUrl, isAnalyzingQuality: true, ignoredWarning: false }
            : slot
        )
      );

      const valResult = await validateImage(dataUrl);

      setPhotoSlots((prev) =>
        prev.map((slot) =>
          slot.id === activeSlotId
            ? { ...slot, validation: valResult, isAnalyzingQuality: false }
            : slot
        )
      );

      if (valResult.hasErrors) {
        const currentSlot = photoSlots.find((s) => s.id === activeSlotId);
        if (currentSlot) {
          setValidationModalSlot({
            ...currentSlot,
            dataUrl,
            validation: valResult,
          });
        }
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectSample = async (sample: typeof sampleScannerTestImages[0]) => {
    setSelectedCrop(sample.crop);
    setCropStage(sample.stage);
    setSymptoms(sample.symptoms);

    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const valResult = await validateImage(dataUrl);
        setPhotoSlots((prev) =>
          prev.map((s, idx) =>
            idx === 0 ? { ...s, dataUrl, validation: valResult, ignoredWarning: false } : s
          )
        );
      };
      reader.readAsDataURL(blob);
    } catch {
      setPhotoSlots((prev) =>
        prev.map((s, idx) => (idx === 0 ? { ...s, dataUrl: sample.url } : s))
      );
    }
  };

  const handleRemovePhoto = (slotId: string) => {
    setPhotoSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? { ...s, dataUrl: undefined, validation: undefined, ignoredWarning: false }
          : s
      )
    );
  };

  const handleIgnoreWarning = (slotId: string) => {
    setPhotoSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, ignoredWarning: true } : s))
    );
    setValidationModalSlot(null);
  };

  const handleRetakeSlot = (slotId: string) => {
    setActiveSlotId(slotId);
    setValidationModalSlot(null);
    setTimeout(() => {
      cameraInputRef.current?.click();
    }, 150);
  };

  const handleRunAnalysis = async () => {
    const imagesWithData = photoSlots.filter((s) => Boolean(s.dataUrl));

    if (imagesWithData.length === 0) {
      setScanError(
        lang === 'lg'
          ? 'Kuba oba teekamu ekifaananyi kimu okutandika okwekenneenya.'
          : lang === 'sw'
          ? 'Tafadhali piga au pakia angalau picha moja ya mmea kabla ya kuchanganua.'
          : 'Please capture or upload at least one plant photograph before analyzing.'
      );
      return;
    }

    const slotWithBlockingError = imagesWithData.find(
      (slot) => slot.validation?.hasErrors && !slot.ignoredWarning
    );

    if (slotWithBlockingError) {
      setValidationModalSlot(slotWithBlockingError);
      setScanError(
        `Photo quality warning for "${slotWithBlockingError.label}". Please check lighting or focus, or proceed anyway.`
      );
      return;
    }

    setScanError(null);
    setIsScanning(true);
    setScanStepIndex(0);

    // Progressive step timers to reflect real pipeline stages
    const timer1 = setTimeout(() => setScanStepIndex(1), 1000);
    const timer2 = setTimeout(() => setScanStepIndex(2), 2200);
    const timer3 = setTimeout(() => setScanStepIndex(3), 3600);
    const timer4 = setTimeout(() => setScanStepIndex(4), 5000);

    try {
      const combinedSymptoms = [
        ...selectedSymptomTags,
        symptoms.trim(),
      ]
        .filter(Boolean)
        .join(', ');

      const payload = {
        crop: selectedCrop,
        cropStage,
        location: locationNotes,
        symptoms: combinedSymptoms,
        language: lang,
        images: imagesWithData.map((s) => ({
          base64: s.dataUrl!,
          mimeType: 'image/jpeg',
          label: s.label,
        })),
      };

      const response = await ApiService.scanPlant(payload);

      if (response && response.analysis) {
        setAnalysisResult(response.analysis);
        setActiveScanId(null);
        setSavedSuccess(false);

        // Auto save to farm history
        const newScan: PlantScan = {
          id: `scan_${Date.now()}`,
          userId: 'user_current',
          farmId: fieldId || 'farm_main',
          cropId: undefined,
          cropName: response.analysis.crop || selectedCrop,
          cropVariety: selectedCrop,
          fieldName: fields.find((f) => f.id === fieldId)?.name || 'Main Field',
          imageUrl: imagesWithData[0]?.dataUrl || '',
          images: imagesWithData.map((s) => ({ url: s.dataUrl!, label: s.label })),
          secondaryImages: imagesWithData.slice(1).map((s) => s.dataUrl!),
          location: locationNotes,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          analysis: response.analysis,
          symptomsReported: combinedSymptoms,
          farmerNotes: symptoms,
          resolved: false,
          status: 'Diagnosed',
        };

        onSaveScan(newScan);
        setActiveScanId(newScan.id);
        setSavedSuccess(true);
      }
    } catch (err: any) {
      setScanError(err.message || 'Diagnostic service error. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsScanning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForNewScan = () => {
    setAnalysisResult(null);
    setActiveScanId(null);
    setSavedSuccess(false);
    setScanError(null);
    setPhotoSlots((prev) =>
      prev.map((s) => ({
        ...s,
        dataUrl: undefined,
        validation: undefined,
        ignoredWarning: false,
      }))
    );
    setSelectedSymptomTags([]);
    setSymptoms('');
  };

  const primaryImage = photoSlots.find((s) => Boolean(s.dataUrl))?.dataUrl;

  return (
    <div className="space-y-6 pb-20">
      {/* Hidden native file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handleImageCapture}
        className="hidden"
      />

      {/* 1. HEADER: Plant Health Scanner + Instruction */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-800/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                {lang === 'lg'
                  ? 'Okukebere Ebirime ne AI'
                  : lang === 'sw'
                  ? 'Kichunguzi cha Afya ya Mmea'
                  : 'Plant Health Scanner'}
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'lg'
                  ? 'Kuba ekifaananyi ekitangaavu ku kitundu ky’ekirime ekirwadde.'
                  : lang === 'sw'
                  ? 'Piga picha wazi ya sehemu iliyoathirika ya mmea wako.'
                  : 'Take a clear photo of the affected part of your plant.'}
              </p>
            </div>
          </div>

          {analysisResult && (
            <button
              onClick={handleResetForNewScan}
              className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another Plant</span>
            </button>
          )}
        </div>
      </div>

      {/* IF RESULTS ARE PRESENT: SHOW BEAUTIFUL RESULTS SCREEN (Section 7 & 8) */}
      {analysisResult ? (
        <div className="space-y-6 animate-in fade-in">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center space-x-2.5 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Diagnosis successfully saved to your farm history and crop timeline!</span>
            </div>
          )}

          {/* Results Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md overflow-hidden">
            {/* Top Bar: Photograph preview, crop name, date, health status */}
            <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/60 dark:bg-stone-900/60">
              <div className="flex items-center space-x-4">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={analysisResult.crop}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 shrink-0">
                    <Leaf className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    {new Date().toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                    <span>{analysisResult.crop}</span>
                    {analysisResult.cropScientificName && (
                      <span className="text-xs font-normal italic text-stone-400">
                        ({analysisResult.cropScientificName})
                      </span>
                    )}
                  </h2>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Field: {fields.find((f) => f.id === fieldId)?.name || 'Main Plot'} · {cropStage}
                  </div>
                </div>
              </div>

              {/* Health Status Badge */}
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs ${
                    analysisResult.healthStatus === 'Healthy'
                      ? 'bg-emerald-500 text-white'
                      : analysisResult.severity === 'Critical'
                      ? 'bg-rose-600 text-white'
                      : analysisResult.severity === 'High'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-400 text-stone-950'
                  }`}
                >
                  {analysisResult.healthStatus}
                </span>

                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Result: POSSIBLE ISSUE & CONFIDENCE */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
                  Possible Issue Detected
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-emerald-950 dark:text-emerald-100">
                  {analysisResult.possibleIssue}
                </h3>

                {/* Visual Confidence Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <div className="text-xs text-stone-600 dark:text-stone-300 flex items-center space-x-1.5 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AI Diagnostic Confidence: <strong>{analysisResult.confidence}%</strong></span>
                    <span className="text-[11px] text-stone-400 font-normal">
                      ({analysisResult.severity} Severity)
                    </span>
                  </div>

                  <div className="w-full sm:w-48 h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResult.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* What We Observed */}
              {analysisResult.observedSymptoms && analysisResult.observedSymptoms.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>What We Observed</span>
                  </h4>
                  <ul className="space-y-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300">
                    {analysisResult.observedSymptoms.map((sym, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Why This May Be Happening */}
              {analysisResult.possibleCauses && analysisResult.possibleCauses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Why This May Be Happening</span>
                  </h4>
                  <ul className="space-y-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300">
                    {analysisResult.possibleCauses.map((cause, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Other Possibilities (Differential Diagnoses) */}
              {analysisResult.otherPossibilities && analysisResult.otherPossibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Other Possibilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.otherPossibilities.map((alt, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* What You Can Do */}
              {analysisResult.nextSteps && analysisResult.nextSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>What You Can Do (Management Steps)</span>
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.nextSteps.map((step, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-emerald-950 dark:text-emerald-200 flex items-start space-x-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prevention Advice */}
              {analysisResult.preventionAdvice && analysisResult.preventionAdvice.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                    Prevention & Long-Term Farm Hygiene
                  </h4>
                  <ul className="space-y-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300">
                    {analysisResult.preventionAdvice.map((prev, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When to Get Expert Help */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-amber-900 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>When to Seek Professional Agricultural Assistance</span>
                </div>
                <p className="leading-relaxed opacity-90">
                  {analysisResult.whenToSeekHelp ||
                    'If more than 20% of your plot is rapidly wilting, symptoms spread to stem tissue, or initial organic sprays fail within 5 days, consult your local district agricultural extension officer for laboratory pathology verification.'}
                </p>
              </div>

              {/* Sources */}
              {analysisResult.sources && analysisResult.sources.length > 0 && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
                  <div className="font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                    <span>Agricultural Reference Sources</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {analysisResult.sources.map((src, i) => {
                      const displayText =
                        typeof src === 'string' ? src : `${src.organization}: ${src.title}`;
                      return <li key={i}>{displayText}</li>;
                    })}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] text-stone-400 italic">
                {analysisResult.disclaimer ||
                  'Agrifarm AI diagnoses are automated computer-vision assessments based on visible symptoms and do not replace certified agronomist inspection.'}
              </p>

              {/* Action Buttons: Save to My Farm, Ask Agrifarm AI, Scan Another Plant */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onConsultAI({
                      cropName: analysisResult.crop,
                      issue: analysisResult.possibleIssue,
                      imageBase64: primaryImage,
                    });
                  }}
                  className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Ask Agrifarm AI About Treatment</span>
                </button>

                <button
                  onClick={handleResetForNewScan}
                  className="px-5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center space-x-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Scan Another Plant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SCAN WORKFLOW: PHOTO -> CROP -> SYMPTOMS -> AI ANALYSIS */
        <div className="space-y-6">
          {/* STEP 1: PHOTO CAPTURE & UPLOAD (Hero Plantix-Inspired Buttons) */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-heading font-extrabold text-base text-stone-900 dark:text-stone-100">
                    Step 1: Capture or Upload Plant Photo
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCameraGuideModalOpen(true)}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Camera Tips</span>
                  </button>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Take a photo directly with your camera or select from your photo gallery
                </p>
              </div>

              {/* Sample testing button */}
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                <span className="text-[11px] text-stone-400">Try sample:</span>
                {sampleScannerTestImages.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 text-[11px] font-semibold border border-stone-200 dark:border-stone-700 whitespace-nowrap"
                  >
                    {sample.crop} ({sample.name})
                  </button>
                ))}
              </div>
            </div>

            {/* DUAL PROMINENT PRIMARY ACTIONS: TAKE PHOTO and UPLOAD PHOTO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-4 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-3 shadow-md shadow-emerald-800/25 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span>TAKE PHOTO (CAMERA)</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="py-4 px-5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-98 text-stone-800 dark:text-stone-200 font-extrabold text-sm sm:text-base flex items-center justify-center space-x-3 border border-stone-200 dark:border-stone-700 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-stone-200 dark:bg-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                </div>
                <span>UPLOAD FROM GALLERY</span>
              </button>
            </div>

            {/* Multi-angle Photo Slots */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Multi-Angle Diagnostic Slots (Add more photos for higher accuracy):</span>
                <span className="text-[11px] text-stone-400 font-normal">
                  {photoSlots.filter((s) => Boolean(s.dataUrl)).length} of 4 attached
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photoSlots.map((slot) => {
                  const hasPhoto = Boolean(slot.dataUrl);
                  const isSelected = activeSlotId === slot.id;
                  const isValid = slot.validation?.isValid;
                  const hasWarning = slot.validation?.hasErrors && !slot.ignoredWarning;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => setActiveSlotId(slot.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between min-h-[140px] ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 bg-stone-50 dark:bg-stone-800/40'
                      }`}
                    >
                      {hasPhoto ? (
                        <div className="relative group/photo">
                          <img
                            src={slot.dataUrl}
                            alt={slot.label}
                            className="w-full h-20 object-cover rounded-xl border border-stone-200 dark:border-stone-700"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePhoto(slot.id);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {hasWarning && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[9px] font-bold">
                              Low Light / Blur
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="h-20 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center text-stone-400">
                          <Camera className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-medium">+ Add Photo</span>
                        </div>
                      )}

                      <div className="mt-2 text-left">
                        <div className="text-[11px] font-bold text-stone-900 dark:text-stone-100 truncate">
                          {slot.label}
                        </div>
                        <div className="text-[10px] text-stone-400 line-clamp-1">
                          {slot.benefit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Helpful Photography Instructions Card */}
            {showPhotoTips && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>For Better Diagnostic Results:</span>
                  </div>
                  <button
                    onClick={() => setShowPhotoTips(false)}
                    className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 text-[11px]"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-900 dark:text-emerald-300 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Use good natural daylight (avoid harsh shadows).</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Keep the plant in sharp focus.</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Photograph the affected area closely (10-20 cm).</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Include insects or fungal powder if visible.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: CROP SELECTION */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs">
            <h3 className="font-heading font-extrabold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Step 2: Select Crop Species</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {[
                { name: 'Tomato', icon: '🍅' },
                { name: 'Maize', icon: '🌽' },
                { name: 'Beans', icon: '🫘' },
                { name: 'Coffee', icon: '☕' },
                { name: 'Cassava', icon: '🥔' },
                { name: 'Rice', icon: '🌾' },
                { name: 'Potato', icon: '🥔' },
                { name: 'Banana', icon: '🍌' },
                { name: 'Cabbage', icon: '🥬' },
                { name: 'Other', icon: '🌱' },
              ].map((item) => {
                const isSelected = selectedCrop === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedCrop(item.name)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: SYMPTOM INFORMATION & NOTES */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-xs">
            <h3 className="font-heading font-extrabold text-base text-stone-900 dark:text-stone-100">
              Step 3: What symptoms are you noticing? (Optional)
            </h3>

            <div className="flex flex-wrap gap-2">
              {commonSymptomChips.map((chip) => {
                const isSelected = selectedSymptomTags.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleSymptomTag(chip)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {chip}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Additional notes: e.g. started after heavy rain, leaves wilting from bottom up..."
              className="w-full px-3.5 py-2.5 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {/* SCAN ERROR FEEDBACK */}
          {scanError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          {/* STEP 4: SUBMIT FOR AI ANALYSIS WITH PROGRESSIVE TIMELINE */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isScanning}
              className={`w-full py-4 px-6 rounded-2xl font-heading font-extrabold text-base flex items-center justify-center space-x-3 shadow-xl transition-all ${
                isScanning
                  ? 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30 active:scale-98'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>ANALYZING YOUR PLANT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  <span>START AI DIAGNOSTIC ANALYSIS</span>
                </>
              )}
            </button>

            {/* Live Progress Experience during analysis (Section 6) */}
            {isScanning && (
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm animate-in fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
                    Analyzing plant symptoms with Agricultural Vision AI...
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {scanSteps.map((step, idx) => {
                    const isDone = idx < scanStepIndex;
                    const isCurrent = idx === scanStepIndex;

                    return (
                      <div
                        key={idx}
                        className={`flex items-start space-x-2.5 transition-opacity ${
                          isDone
                            ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                            : isCurrent
                            ? 'text-stone-900 dark:text-stone-100 font-bold'
                            : 'text-stone-400 opacity-60'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700" />
                          )}
                        </div>
                        <div>
                          <div>{step.label}</div>
                          <div className="text-[11px] text-stone-400 font-normal">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: IMAGE VALIDATION WARNING (Blur or Low Light) */}
      {validationModalSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100">
                Photo Quality Warning
              </h3>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              We detected potential issues with lighting or focus. Unclear photos reduce diagnostic confidence:
            </p>

            <div className="space-y-2">
              {validationModalSlot.validation?.issues.map((iss, i) => (
                <div key={i} className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-200">{iss.title}</div>
                  <div className="text-stone-600 dark:text-stone-300 text-[11px]">{iss.message}</div>
                  <div className="text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                    💡 Tip: {iss.recommendation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => handleIgnoreWarning(validationModalSlot.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-300"
              >
                Proceed Anyway
              </button>
              <button
                type="button"
                onClick={() => handleRetakeSlot(validationModalSlot.id)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMERA PERMISSION & PHOTOGRAPHY TIPS MODAL */}
      <CameraPermissionModal
        isOpen={isCameraGuideModalOpen}
        onClose={() => setIsCameraGuideModalOpen(false)}
        onPermissionGranted={() => {
          setIsCameraGuideModalOpen(false);
          cameraInputRef.current?.click();
        }}
        lang={lang}
      />
    </div>
  );
};
