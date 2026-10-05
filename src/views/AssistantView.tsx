import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Image as ImageIcon,
  X,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Sprout,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Farm, Crop, Language } from '../types';
import { ApiService } from '../services/apiService';
import { t } from '../services/i18n';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachedImage?: {
    base64: string;
    mimeType: string;
    preview: string;
  };
}

interface AssistantViewProps {
  farm: Farm;
  crops: Crop[];
  lang: Language;
  initialPrompt?: string;
  initialImage?: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  farm,
  crops,
  lang,
  initialPrompt,
  initialImage,
}) => {
  const getWelcomeContent = (l: Language) => {
    if (l === 'lg') {
      return `Oli otya nno! Nze **Agrifarm Uganda**, omukugu wo ow'ebyobulimi n'okulongoosa ffaamu yo mu Uganda.

Nsobola okukuyambako ku:
- **Okukekkebya endwadde z'ebirime (matooke, emmwanyi, kasooli, ebijanjalo)**
- **Obugimu bw'ettaka n'okukola nakavundira (organic compost)**
- **Enteekateeka y'okufukirira n'okugoberera enkuba mu bitundu bya Uganda**
- **Engeri y'okutangiramu ebiwuka n'eddagala eritatta ttaka (IPM)**
- **Amakungula n'okukuuma ebiwandiiko bya ffaamu (mu Shillings UGX)**

Buuza ekibuuzo kyonna wansi oba teekako ekifaananyi ky'ekirime kyo!`;
    }
    if (l === 'sw') {
      return `Habari za kazi! Mimi ni **Agrifarm Uganda**, mshauri wako wa kidijitali wa kilimo na afya ya mazao nchini Uganda.

Ninaweza kukusaidia kuhusu:
- **Utambuzi wa magonjwa ya mazao na wadudu waharibifu (ndizi, kahawa, mahindi, maharage)**
- **Rutuba ya udongo na uandaaji wa mbolea ya asili (mboji)**
- **Ratiba ya umwagiliaji kulingana na misimu ya mvua ya Uganda**
- **Udhibiti Jumuishi wa Wadudu (IPM)**
- **Upangaji wa mavuno na kumbukumbu za fedha za shamba (UGX)**

Uliza swali lako hapa chini au pakia picha ya zao lako!`;
    }
    return `Hello! I am **Agrifarm Uganda**, your digital agricultural consultant and agronomist tailored for Ugandan farming conditions. 

I can assist you with:
- **Crop disease & pest diagnosis (Matooke, Coffee, Maize, Beans, Cassava, Irish Potatoes)**
- **Soil fertility, lime, and organic compost formulations**
- **Ugandan seasonal rain patterns & irrigation scheduling**
- **Integrated Pest Management (IPM) & Good Agricultural Practices (GAP)**
- **Farm record keeping & budget management in Uganda Shillings (UGX)**

Feel free to ask a question below or upload a photo of your plant!`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: getWelcomeContent(lang),
      timestamp: new Date().toISOString(),
    },
  ]);

  // Update welcome message if language changes and only welcome is present
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg_welcome') {
        return [
          {
            ...prev[0],
            content: getWelcomeContent(lang),
          },
        ];
      }
      return prev;
    });
  }, [lang]);

  const [input, setInput] = useState(initialPrompt || '');
  const [attachedImage, setAttachedImage] = useState<{
    base64: string;
    mimeType: string;
    preview: string;
  } | null>(
    initialImage
      ? {
          base64: initialImage,
          mimeType: 'image/jpeg',
          preview: initialImage,
        }
      : null
  );

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickQuestions =
    lang === 'lg'
      ? [
          'Nnyinza ntya okumanya oba kasooli wange alina obulwadde?',
          'Ebikoola byange eby’ennyaanya bikyuka ne biba bya kyenvu.',
          'Biwuka ki ebirya enva endiirwa eza kabegi?',
          'Ddi lwe nsaana okufukirira ebirime byange?',
          'Nkola ntya eddagala ly’obutonde ery’enniimu (Neem spray)?',
        ]
      : lang === 'sw'
      ? [
          'Jinsi gani nitajua kama mahindi yangu yana ugonjwa?',
          'Majani yangu ya nyanya yanageuka manjano.',
          'Wadudu gani wanasumbua kabichi?',
          'Ni lini ninapaswa kumwagilia mazao yangu?',
          'Jinsi ya kutengeneza dawa ya asili ya mwarobaini (Neem spray)?',
        ]
      : [
          'How do I know if my maize has a disease?',
          'My tomato leaves are turning yellow.',
          'What pests affect cabbage?',
          'When should I irrigate my crops?',
          'How do I prepare an organic neem spray for pests?',
        ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAttachedImage({
        base64: dataUrl,
        mimeType: file.type || 'image/jpeg',
        preview: dataUrl,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText !== undefined ? messageText : input;
    if ((!textToSend.trim() && !attachedImage) || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
      attachedImage: attachedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const imageToSend = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const activeCropsStr = crops.map((c) => `${c.name} (${c.growthStage})`).join(', ');

      const res = await ApiService.sendChatMessage({
        message: userMessage.content,
        history,
        language: lang,
        attachedImage: imageToSend
          ? {
              base64: imageToSend.base64,
              mimeType: imageToSend.mimeType,
            }
          : undefined,
        farmContext: {
          farmName: farm.name,
          location: `${farm.district}, ${farm.location}`,
          crops: activeCropsStr,
        },
      });

      const assistantMessage: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat failed:', err);
      const errorMessage: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content:
          '⚠️ ' + (err.message || 'I could not connect to the agricultural knowledge base. Please check your internet connection.'),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format basic markdown-like bullet points & bold in chat replies
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-extrabold text-stone-900 dark:text-stone-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm my-0.5 text-stone-800 dark:text-stone-200">
            {renderedLine}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm my-1 leading-relaxed text-stone-800 dark:text-stone-200">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] min-h-[500px] max-h-[820px] bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-md overflow-hidden transition-colors">
      {/* Assistant Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-center shadow-inner">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-heading font-extrabold text-base tracking-tight text-white">
                Agrifarm Uganda AI
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-200">
              {lang === 'lg'
                ? 'Omuyambi wo ow’amagezi mu by’obulimi'
                : lang === 'sw'
                ? 'Msaidizi wako mahiri wa kilimo'
                : 'Your intelligent farming assistant'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-emerald-200">
          <span className="px-2.5 py-1 bg-white/10 rounded-full border border-white/15">
            Farm: {farm.name}
          </span>
          <span className="px-2 py-0.5 bg-emerald-500/20 rounded-md font-mono text-[10px] uppercase font-bold text-emerald-300">
            {lang}
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/60 dark:bg-stone-950/60">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 max-w-[88%] sm:max-w-[78%] ${
                isUser ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-stone-900 text-white'
                    : 'bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm shadow-xs ${
                  isUser
                    ? 'bg-emerald-800 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200/90 dark:border-stone-800 rounded-tl-xs'
                }`}
              >
                {/* Attached image preview */}
                {msg.attachedImage && (
                  <div className="mb-2 rounded-xl overflow-hidden max-h-48 border border-white/20">
                    <img
                      src={msg.attachedImage.preview}
                      alt="Attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>{renderFormattedContent(msg.content)}</div>

                <div
                  className={`text-[9px] mt-2 text-right ${
                    isUser ? 'text-emerald-200' : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2.5 mr-auto">
            <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-stone-900 p-3.5 rounded-3xl rounded-tl-xs border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>
                {lang === 'lg'
                  ? 'Agrifarm AI ekyekenneenya ebiragiro by’ebyobulimi...'
                  : lang === 'sw'
                  ? 'Agrifarm AI inachambua miongozo ya kilimo...'
                  : 'Agrifarm AI is reviewing agronomy guidelines...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length < 4 && (
        <div className="px-4 py-2 bg-stone-100/70 dark:bg-stone-800/60 border-t border-stone-200/60 dark:border-stone-800 overflow-x-auto scrollbar-none flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 mr-1" />
            {lang === 'lg' ? 'Ebikulu:' : lang === 'sw' ? 'Pendekezo:' : 'Suggested:'}
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 text-stone-700 dark:text-stone-300 rounded-full text-xs font-medium border border-stone-200 dark:border-stone-700 whitespace-nowrap transition-colors flex-shrink-0 shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Attached image preview banner before sending */}
      {attachedImage && (
        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
          <div className="flex items-center space-x-2">
            <img
              src={attachedImage.preview}
              alt="Attached preview"
              className="w-8 h-8 rounded-lg object-cover border border-emerald-300 dark:border-emerald-700"
            />
            <span className="font-semibold">
              {lang === 'lg'
                ? 'Ekifaananyi kyongeddwako okukeberebwa'
                : lang === 'sw'
                ? 'Picha imeambatanishwa kwa uchunguzi wa kuona'
                : 'Plant photo attached for visual consultation'}
            </span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="p-1 rounded-full text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            title="Attach plant photograph"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(lang, 'chatPlaceholder')}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={(!input.trim() && !attachedImage) || isLoading}
            className={`p-2.5 rounded-xl transition-all ${
              (!input.trim() && !attachedImage) || isLoading
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 active:scale-95'
            }`}
            title={t(lang, 'sendPrompt')}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
