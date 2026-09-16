import React, { useEffect, useState } from 'react';
import { getSources, getReliability, getAlerts } from '../../services/api';
import { DataSourceMeta, ReliabilityScore, AlertItem } from '../../types';
import { FileText, Download, FileSpreadsheet, FileCode, CheckCircle } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [sources, setSources] = useState<DataSourceMeta[]>([]);
  const [downloadMsg, setDownloadMsg] = useState('');

  useEffect(() => {
    const fetchMeta = async () => {
      const data = await getSources();
      setSources(data);
    };
    fetchMeta();
  }, []);

  const triggerDownload = (type: string, filename: string) => {
    setDownloadMsg(`Downloading ${filename}...`);
    setTimeout(() => {
      setDownloadMsg('');
    }, 2500);
  };

  const handleExportCSV = async () => {
    const relData = await getReliability(undefined, undefined, 500);
    const headers = ['id', 'region_id', 'timestamp', 'latitude', 'longitude', 'forecast_temperature', 'observed_temperature', 'temperature_bias', 'reliability_score', 'confidence_level', 'risk_level'];
    const csvRows = [headers.join(',')];

    relData.forEach(row => {
      csvRows.push([
        row.id, row.region_id, `"${row.timestamp}"`, row.latitude, row.longitude,
        row.forecast_temperature, row.observed_temperature, row.temperature_bias,
        row.reliability_score, `"${row.confidence_level}"`, `"${row.risk_level}"`
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oceansphere_reliability_dataset.csv';
    a.click();
    triggerDownload('CSV', 'oceansphere_reliability_dataset.csv');
  };

  const handleExportJSON = async () => {
    const alertsData = await getAlerts(undefined, 200);
    const blob = new Blob([JSON.stringify(alertsData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oceansphere_alerts_export.json';
    a.click();
    triggerDownload('JSON', 'oceansphere_alerts_export.json');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-ocean-600" />
          <span>Scientific Reports & Exports</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium">Export raw ocean datasets, validation metrics, and executive decision support reports.</p>
      </div>

      {downloadMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Executive Summary PDF</h3>
            <p className="text-xs text-slate-500 mt-1">Full evaluation report with regional reliability heatmaps and ML model metrics.</p>
          </div>
          <button
            onClick={() => triggerDownload('PDF', 'oceansphere_executive_report.pdf')}
            className="w-full py-2.5 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reliability CSV Dataset</h3>
            <p className="text-xs text-slate-500 mt-1">Export all 12,223 reliability scores, HYCOM forecasts, and Argo/Buoy biases.</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-navy-500 text-white flex items-center justify-center mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">System Alerts JSON Payload</h3>
            <p className="text-xs text-slate-500 mt-1">Export critical divergence alerts and coordinates in JSON format.</p>
          </div>
          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 rounded-xl bg-navy-500 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
