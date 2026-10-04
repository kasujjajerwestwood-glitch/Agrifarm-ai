import React, { useState } from 'react';
import {
  Cpu,
  Droplets,
  Thermometer,
  CloudRain,
  Sun,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Code,
  ArrowRight,
  ShieldCheck,
  Power,
} from 'lucide-react';
import { SensorReading, Language } from '../types';

interface MonitoringViewProps {
  sensors: SensorReading[];
  onUpdateSensor: (updated: SensorReading) => void;
  lang: Language;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  sensors,
  onUpdateSensor,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'irrigation' | 'hardware'>('dashboard');
  const [isSimulating, setIsSimulating] = useState(false);
  const [pumpState, setPumpState] = useState<'IDLE' | 'SCHEDULED' | 'SAFETY_LOCKED'>('IDLE');

  // Trigger demo sensor fluctuation
  const handleSimulateRefresh = () => {
    setIsSimulating(true);
    setTimeout(() => {
      sensors.forEach((s) => {
        let delta = (Math.random() - 0.5) * 1.5;
        if (s.type === 'soil_moisture') delta = (Math.random() - 0.5) * 3;
        const newVal = Math.max(0, Math.min(100, Number((s.value + delta).toFixed(1))));
        onUpdateSensor({
          ...s,
          value: newVal,
          timestamp: new Date().toISOString(),
        });
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded-full mb-1">
            <Cpu className="w-3.5 h-3.5 text-blue-700" />
            <span>Telemetry & Smart Hardware</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Farm Monitoring & IoT
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Live rootzone soil parameters, micro-climate stations, and future automated irrigation relay architecture.
          </p>
        </div>

        {/* Demo Notice & Refresh */}
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>DEMO / SIMULATED HARDWARE</span>
          </div>
          <button
            onClick={handleSimulateRefresh}
            disabled={isSimulating}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
            title="Poll Sensor Nodes"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-2 ${
            activeTab === 'dashboard'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Live Sensor Grid
        </button>
        <button
          onClick={() => setActiveTab('irrigation')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-2 ${
            activeTab === 'irrigation'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Smart Irrigation Controller
        </button>
        <button
          onClick={() => setActiveTab('hardware')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all px-2 ${
            activeTab === 'hardware'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          ESP32 / Arduino Integration
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Sensor Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sensors.map((sensor) => {
              const percentOfMax = Math.min(100, Math.round((sensor.value / sensor.maxOptimal) * 100));

              return (
                <div
                  key={sensor.id}
                  className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 hover:border-emerald-300 transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 block font-semibold">
                        {sensor.sensorId} • {sensor.deviceName}
                      </span>
                      <h3 className="font-heading font-bold text-base text-stone-900 mt-0.5">
                        {sensor.label}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                        sensor.status === 'optimal'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sensor.status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </div>

                  {/* Big Value presentation */}
                  <div className="flex items-baseline space-x-1.5 py-1">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900">
                      {sensor.value}
                    </span>
                    <span className="text-sm font-bold text-stone-500">{sensor.unit}</span>
                  </div>

                  {/* Progress indicator */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span>Target Band: {sensor.minOptimal}{sensor.unit} - {sensor.maxOptimal}{sensor.unit}</span>
                      <span>{percentOfMax}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          sensor.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(10, percentOfMax))}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-400">
                    <span>Updated {new Date(sensor.timestamp).toLocaleTimeString()}</span>
                    <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-bold">
                      DEMO TELEMETRY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'irrigation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
              <Droplets className="w-3.5 h-3.5 text-emerald-700" />
              <span>Future Closed-Loop Architecture</span>
            </div>
            <h2 className="font-heading font-extrabold text-xl text-stone-900">
              Smart Drip & Solenoid Valve Control
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Agrifarm AI is engineered to bridge soil moisture sensors, weather predictions, and automated pump relays. In this release, manual oversight is enforced for safety.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-4">
              Architecture Signal Path:
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold">
              <span className="p-3 bg-white border border-stone-200 rounded-xl text-stone-800 shadow-2xs">
                🌱 Soil Moisture Probe
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
              <span className="p-3 bg-white border border-stone-200 rounded-xl text-stone-800 shadow-2xs">
                📡 ESP32 Gateway
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
              <span className="p-3 bg-emerald-700 text-white rounded-xl shadow-xs">
                ☁️ Agrifarm Cloud AI
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
              <span className="p-3 bg-white border border-stone-200 rounded-xl text-stone-800 shadow-2xs">
                👨‍🌾 Farmer Approval
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
              <span className="p-3 bg-blue-700 text-white rounded-xl shadow-xs">
                💧 Solar Drip Pump
              </span>
            </div>
          </div>

          {/* Safety & Recommendation Card */}
          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Current AI Irrigation Recommendation for Greenhouse Alpha:</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Soil moisture is currently at <strong>58.4% VWC</strong> with moderate transpiration demand. Rain probability is 25%. Next recommended drip run: <strong>Today at 4:30 PM (25 minutes cycle)</strong>.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => setPumpState('SCHEDULED')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Approve 25min Irrigation Cycle
              </button>
              <button
                onClick={() => setPumpState('SAFETY_LOCKED')}
                className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs rounded-xl transition-colors"
              >
                Hold / Rain Delay
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hardware' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-stone-900">
              Hardware Developer & ESP32 Webhook Integration
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Easily connect real-world ESP32, ESP8266, Arduino LoRa, or Raspberry Pi microcontrollers using standard JSON HTTP POST payloads.
            </p>
          </div>

          <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl font-mono text-xs overflow-x-auto space-y-2">
            <div className="text-stone-400">// Sample ESP32 Arduino C++ HTTP Payload</div>
            <pre className="text-emerald-400">
{`HTTPClient http;
http.begin("https://your-agrifarm-domain.run.app/api/sensors/ingest");
http.addHeader("Content-Type", "application/json");

String payload = "{"
  "\"sensorId\": \"ESP32-NODE-GH01\","
  "\"soilMoisture\": 58.4,"
  "\"temperature\": 26.8,"
  "\"humidity\": 78.2,"
  "\"tankLevel\": 84.0"
"}";

int httpCode = http.POST(payload);
http.end();`}
            </pre>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1.5">
            <span className="font-bold block">Supported Sensor Models:</span>
            <ul className="list-disc list-inside space-y-0.5 text-blue-800">
              <li>Capacitive Soil Moisture Sensors (v1.2 / v2.0 analog)</li>
              <li>DHT22 / SHT30 High Accuracy Temperature & Relative Humidity</li>
              <li>JSN-SR04T Waterproof Ultrasonic Tank Depth Transducer</li>
              <li>RS485 Industrial Soil NPK & pH Probes</li>
              <li>Tipping Bucket Rain Gauge Sensors</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
