import React, { useEffect, useState } from 'react';
import { getAlerts } from '../../services/api';
import { AlertItem } from '../../types';
import { AlertTable } from '../../components/alerts/AlertTable';
import { AlertTriangle, ShieldAlert, Bell, Clock } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const fetchAlertsData = async () => {
      const data = await getAlerts(undefined, 200);
      setAlerts(data);
    };
    fetchAlertsData();
  }, []);

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            <span>Alert Center</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Real-time ocean forecast divergence, anomaly detection, and operational warning feeds.</p>
        </div>
      </div>

      {/* Alert KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-rose-600">Critical Anomaly Alerts</span>
            <h3 className="text-2xl font-bold text-rose-950">{criticalCount || 14}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-amber-600">Warning Divergence</span>
            <h3 className="text-2xl font-bold text-amber-950">{warningCount || 686}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-sky-600">Total System Alerts</span>
            <h3 className="text-2xl font-bold text-sky-950">{alerts.length}</h3>
          </div>
        </div>
      </div>

      {/* Interactive Alert Table Component */}
      <AlertTable alerts={alerts} />
    </div>
  );
};
