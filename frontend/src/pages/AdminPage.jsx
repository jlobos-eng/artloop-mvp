import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ImageIcon, KeyRound, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { api, ApiClientError } from '../api/client';
import { useToast } from '../components/Toast';

const TOKEN_KEY = 'artloop:admin-token';
const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 MB

export function AdminPage({ onBack, onCreated }) {
  const toast = useToast();
  const [token, setToken] = useState(() => {
    try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
  });
  const [authed, setAuthed] = useState(Boolean(token));

  if (!authed) {
    return (
      <div className="py-20 max-w-md mx-auto">
        <button onClick={onBack} className="btn-ghost mb-8 text-sm">
          <ArrowLeft size={16} /> Volver
        </button>
        <div className="glass rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-fuchsia-500/15 border border-fuchsia-500/30 mb-5">
            <KeyRound size={20} className="text-fuchsia-300" />
          </div>
          <h2 className="font-display text-2xl font-bold">Panel privado</h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Ingresa el token de administración para publicar nuevas obras.
          </p>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!token.trim()) return;
              try { sessionStorage.setItem(TOKEN_KEY, token.trim()); } catch { /* ignore */ }
              setAuthed(true);
            }}
          >
            <input
              type="password"
              autoFocus
              autoComplete="off"
              placeholder="Admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input"
            />
            <button type="submit" className="btn-primary w-full">
              <ShieldCheck size={16} /> Acceder
            </button>
          </form>
          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
            El token se almacena solo en esta sesión y se envía mediante el header{' '}
            <code className="text-slate-300">x-admin-token</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminForm
      onBack={onBack}
      onCreated={onCreated}
      adminToken={token}
      onLogout={() => {
        try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
        setToken('');
        setAuthed(false);
      }}
    />
  );
}

function AdminForm({ onBack, onCreated, adminToken, onLogout }) {
  const toast = useToast();
  const [form, setForm] = useState({
    title: '', artist: '', image: '', description: '',
    dimensions: '', style: '', technique: '', year: '', // NUEVOS CAMPOS
    originalBid: '', printPrice: '', totalPrints: 500,
  });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim() || form.title.length < 2) e.title = 'Título demasiado corto';
    if (!form.artist.trim() || form.artist.length < 2) e.artist = 'Nombre del artista requerido';
    if (!form.image) e.image = 'Sube una imagen';

    // VALIDACIÓN NUEVOS CAMPOS
    if (!form.dimensions.trim()) e.dimensions = 'Falta tamaño (ej. 120x80 cm)';
    if (!form.technique.trim()) e.technique = 'Falta técnica (ej. Óleo sobre lienzo)';
    if (!form.year) e.year = 'Falta año (ej. 2024)';

    if (!form.originalBid || Number(form.originalBid) <= 0) e.originalBid = 'Precio inválido';
    if (!form.printPrice || Number(form.printPrice) <= 0) e.printPrice = 'Precio inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Imagen muy pesada', 'El máximo recomendado es 6 MB. Compactala antes de subir.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      update('image', reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      toast.error('Revisa el formulario', 'Hay campos pendientes por completar.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        originalBid: Number(form.originalBid),
        printPrice: Number(form.printPrice),
        totalPrints: Number(form.totalPrints) || 500,
      };
      const res = await api.createDrop(payload, { adminToken });
      toast.success('Obra publicada', `"${res.drop?.title || form.title}" está en vivo.`);
      setForm({
        title: '', artist: '', image: '', description: '',
        dimensions: '', style: '', technique: '', year: '',
        originalBid: '', printPrice: '', totalPrints: 500
      });
      setPreview(null);
      onCreated?.(res.drop);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Error desconocido';
      if (err?.status === 401) {
        toast.error('Token inválido', 'Vuelve a autenticarte para continuar.');
        onLogout();
      } else {
        toast.error('No se pudo publicar', msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 md:py-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="btn-ghost text-sm">
          <ArrowLeft size={16} /> Volver
        </button>
        <button onClick={onLogout} className="btn-ghost text-xs">
          Cerrar sesión admin
        </button>
      </div>

      <div className="glass rounded-3xl p-6 md:p-10">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-fuchsia-500/15 border border-fuchsia-500/30">
            <Sparkles size={20} className="text-fuchsia-300" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">Publicar nueva obra</h2>
            <p className="text-slate-400 text-sm mt-1">
              La pieza aparecerá en la curaduría inmediatamente y comenzará un ciclo de 24 horas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Título" error={errors.title}>
            <input
              className="input"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Ecos del Vacío"
              maxLength={80}
            />
          </Field>

          <Field label="Artista" error={errors.artist}>
            <input
              className="input"
              value={form.artist}
              onChange={(e) => update('artist', e.target.value)}
              placeholder="Elena Rostova"
              maxLength={80}
            />
          </Field>

          {/* FICHA TÉCNICA (NUEVOS CAMPOS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Dimensiones" error={errors.dimensions}>
              <input
                className="input"
                value={form.dimensions}
                onChange={(e) => update('dimensions', e.target.value)}
                placeholder="Ej: 120 x 80 cm"
                maxLength={50}
              />
            </Field>
            <Field label="Año" error={errors.year}>
              <input
                type="number"
                className="input"
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
                placeholder="Ej: 2024"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Técnica" error={errors.technique}>
              <input
                className="input"
                value={form.technique}
                onChange={(e) => update('technique', e.target.value)}
                placeholder="Ej: Óleo sobre lienzo"
                maxLength={80}
              />
            </Field>
            <Field label="Estilo (Opcional)">
              <input
                className="input"
                value={form.style}
                onChange={(e) => update('style', e.target.value)}
                placeholder="Ej: Expresionismo"
                maxLength={80}
              />
            </Field>
          </div>

          <Field label="Descripción (opcional)">
            <textarea
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Notas curatoriales, historia de la obra..."
              maxLength={1000}
            />
          </Field>

          <Field label="Imagen de la obra" error={errors.image}>
            <label className="relative block w-full rounded-2xl border-2 border-dashed border-white/10 hover:border-fuchsia-500/50 transition-colors cursor-pointer p-6 text-center">
              <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center pointer-events-none">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-40 object-contain rounded-xl" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl grid place-items-center bg-white/5 border border-white/10 mb-3">
                    <ImageIcon size={20} className="text-slate-300" />
                  </div>
                )}
                <p className="text-slate-300 mt-3 text-sm font-medium">
                  {preview ? 'Imagen lista. Click para reemplazar.' : 'Click para subir desde tu equipo'}
                </p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG o WebP · hasta 6 MB</p>
              </div>
            </label>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Valor original (USD)" error={errors.originalBid}>
              <CurrencyInput value={form.originalBid} onChange={(v) => update('originalBid', v)} />
            </Field>
            <Field label="Precio print (USD)" error={errors.printPrice}>
              <CurrencyInput value={form.printPrice} onChange={(v) => update('printPrice', v)} />
            </Field>
            <Field label="Edición">
              <input
                type="number"
                min={1}
                max={10000}
                className="input"
                value={form.totalPrints}
                onChange={(e) => update('totalPrints', e.target.value)}
              />
            </Field>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2 py-4">
            {submitting ? (
              <>
                <Zap size={16} className="animate-pulse" /> Publicando…
              </>
            ) : (
              <>Publicar en ArtLoop</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        {label}
      </span>
      {children}
      {error && <span className="block text-rose-400 text-xs mt-1.5">{error}</span>}
    </label>
  );
}

function CurrencyInput({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
      <input
        type="number"
        min={0}
        step="any"
        className="input pl-7"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
      />
    </div>
  );
}