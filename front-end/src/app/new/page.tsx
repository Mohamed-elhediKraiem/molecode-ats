"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  SendHorizonal,
  Globe2,
  Building2,
  Type,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function NewCandidaturePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    society: "",
    url: "",
    status: "en attente",
  });

  const [loading, setLoading] = useState(false);

  // --- Remplissage automatique depuis l’URL ---
  const fetchMetadata = async (url: string) => {
    if (!url) return;
    setLoading(true);
    toast.loading("Analyse du lien en cours...");

    try {
      // ✅ Appel à ton backend Python
      const res = await fetch(
        `http://localhost:8000/scrape?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) throw new Error("Erreur du serveur scraping");

      const data = await res.json();
      toast.dismiss();

      if (data?.title || data?.company) {
        setFormData((prev) => ({
          ...prev,
          title: data.title || prev.title,
          society: data.company || prev.society,
        }));
        toast.success("Données récupérées depuis le lien !");
      } else {
        toast.error("Impossible d’extraire les informations.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Erreur lors de l’analyse du lien.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Envoi de la candidature ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Ajout de la candidature...");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          creationDate: new Date(),
        }),
      });

      toast.dismiss();

      if (res.ok) {
        toast.success("Candidature ajoutée avec succès !");
        setTimeout(() => router.push("/"), 1500);
      } else {
        toast.error("Erreur lors de l’ajout de la candidature.");
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8 font-display text-[#333]">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
          <SendHorizonal className="text-purple-700" />
          Nouvelle candidature
        </h1>

        {/* ⚠️ Avertissement */}
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm mb-6">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Le remplissage automatique ne fonctionne que pour{" "}
            <strong>LinkedIn</strong> et <strong>Welcome to the Jungle</strong>.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <Globe2 className="inline w-4 h-4 mr-1 text-purple-700" />
              Lien de l’offre
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://exemple.com/offre"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                type="button"
                onClick={() => fetchMetadata(formData.url)}
                className="px-4 py-2 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800 transition"
                disabled={!formData.url || loading}
              >
                {loading ? "Analyse..." : "Remplir"}
              </button>
            </div>
          </div>

          {/* Titre du poste */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <Type className="inline w-4 h-4 mr-1 text-purple-700" />
              Titre du poste
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Développeur Front-End"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Entreprise */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <Building2 className="inline w-4 h-4 mr-1 text-purple-700" />
              Entreprise
            </label>
            <input
              type="text"
              required
              placeholder="Nom de l’entreprise"
              value={formData.society}
              onChange={(e) =>
                setFormData({ ...formData, society: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="en attente">En attente</option>
              <option value="accepté">Accepté</option>
              <option value="refusé">Refusé</option>
            </select>
          </div>

          {/* Date de création */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <CalendarDays className="inline w-4 h-4 mr-1 text-purple-700" />
              Date de création
            </label>
            <input
              type="text"
              value={new Date().toLocaleDateString("fr-FR")}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          {/* Bouton d’envoi */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-700 text-white py-3 font-semibold text-sm hover:bg-purple-800 transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <CheckCircle2 />
            )}
            {loading ? "Envoi..." : "Ajouter la candidature"}
          </button>
        </form>
      </div>
    </div>
  );
}
