import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Search,
  Eye,
  Trash2,
  Edit,
  Check,
  CheckCircle2,
  QrCode,
  LogOut,
  ArrowLeft,
  Download,
  ShieldAlert,
  KeyRound,
  Settings,
  X,
} from "lucide-react";

import aaryansLogo from "./assets/image.png";

/* =========================================================
   CREATE PUBLIC QR URL
   ========================================================= */

function createCardUrl(card) {
  const payload = {
    id: card.id,
    fullName: card.fullName || "",
    title: card.title || "",
    email: card.email || "",
    phone: card.phone || "",
    address: card.address || "",
    company: card.company || "Aaryans Group of Companies",
    website: card.website || "www.aaryans.group",
  };

  const url = new URL(
    `/card/${encodeURIComponent(card.id)}`,
    window.location.origin,
  );

  // Put the complete card inside the QR URL.
  url.searchParams.set("data", JSON.stringify(payload));

  return url.toString();
}

/* =========================================================
   VCARD
   ========================================================= */

function generateVCard(card) {
  if (!card) return "";

  return `BEGIN:VCARD
VERSION:3.0
FN:${card.fullName || ""}
TITLE:${card.title || ""}
ORG:Aaryans Group of Companies
TEL;TYPE=CELL:${card.phone || ""}
EMAIL:${card.email || ""}
ADR;TYPE=WORK:;;${(card.address || "").replace(/\n/g, ", ")}
URL:https://www.aaryans.group
END:VCARD`;
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem("app_business_cards");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminCreds, setAdminCreds] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_credentials");
      return saved
        ? JSON.parse(saved)
        : { username: "admin", password: "admin123" };
    } catch {
      return { username: "admin", password: "admin123" };
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("admin_session") === "true";
  });

  useEffect(() => {
    localStorage.setItem("app_business_cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("admin_credentials", JSON.stringify(adminCreds));
  }, [adminCreds]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        <Routes>
          {/* PUBLIC FORM */}
          <Route
            path="/"
            element={<PublicFormPage cards={cards} setCards={setCards} />}
          />

          {/* QR CARD PAGE */}
          <Route path="/card/:id" element={<PublicCardView cards={cards} />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminPanel
                cards={cards}
                setCards={setCards}
                adminCreds={adminCreds}
                setAdminCreds={setAdminCreds}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

/* =========================================================
   BUSINESS CARD DESIGN
   ========================================================= */

function ExactBusinessCard({ card }) {
  if (!card) return null;

  return (
    <div className="w-[340px] max-w-full bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
      {/* TOP */}
      <div className="bg-[#5B1B20] text-white pt-8 pb-16 px-6 text-center rounded-b-[2rem] shadow-md flex flex-col items-center">
        <img
          src={aaryansLogo}
          alt="Aaryans"
          className="h-14 w-auto object-contain mb-2"
        />
        <p className="text-[#E2BA6E] text-xs font-semibold tracking-wide">
          Aaryans Group of Companies
        </p>
      </div>

      {/* NAME */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl py-6 px-4 text-center border">
          <h1 className="text-xl font-extrabold text-[#5B1B20] tracking-wider uppercase">
            {card.fullName}
          </h1>
          <p className="text-slate-600 font-medium text-sm mt-2">
            {card.title}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-7 space-y-4 text-xs text-slate-700">
        {card.email && (
          <a href={`mailto:${card.email}`} className="flex items-start gap-3.5">
            <Mail className="w-4 h-4 text-[#5B1B20] shrink-0 mt-0.5" />
            <span className="break-all font-semibold">{card.email}</span>
          </a>
        )}

        {card.phone && (
          <a
            href={`tel:+91${card.phone}`}
            className="flex items-center gap-3.5"
          >
            <Phone className="w-4 h-4 text-[#5B1B20] shrink-0" />
            <span className="font-semibold">+91 {card.phone}</span>
          </a>
        )}

        {card.address && (
          <div className="flex items-start gap-3.5">
            <MapPin className="w-4 h-4 text-[#5B1B20] shrink-0 mt-0.5" />
            <span className="leading-relaxed whitespace-pre-line">
              {card.address}
            </span>
          </div>
        )}

        <a
          href="https://www.aaryans.group"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3.5"
        >
          <Globe className="w-4 h-4 text-[#5B1B20] shrink-0" />
          <span className="font-semibold">www.aaryans.group</span>
        </a>
      </div>
    </div>
  );
}

/* =========================================================
   PUBLIC CREATE CARD PAGE
   ========================================================= */

function PublicFormPage({ cards, setCards }) {
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    address: "",
  });

  const [qrUrl, setQrUrl] = useState("");
  const [generatedCard, setGeneratedCard] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    /* PHONE VALIDATION */
    if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const cleanName =
      formData.fullName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "card";

    const newCard = {
      id: `${cleanName}-${Date.now()}`,
      fullName: formData.fullName.trim(),
      title: formData.title.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      company: "Aaryans Group of Companies",
      website: "www.aaryans.group",
      createdAt: new Date().toLocaleDateString("en-IN"),
    };

    /* SAVE LOCALLY FOR ADMIN */
    setCards((previous) => [newCard, ...previous]);

    /* CREATE QR URL CONTAINING FULL CARD DATA */
    const url = createCardUrl(newCard);

    setGeneratedCard(newCard);
    setQrUrl(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-[#5B1B20] text-white py-4 px-6 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={aaryansLogo} alt="Aaryans" className="h-10 w-auto" />
          <div>
            <h1 className="font-bold text-lg">Aaryans Digital Portal</h1>
            <p className="text-[10px] text-amber-200">
              Business Card & QR Studio
            </p>
          </div>
        </div>

        <Link
          to="/admin"
          className="text-xs bg-black/20 text-amber-200 border border-amber-300/30 px-3.5 py-2 rounded-xl flex items-center gap-2"
        >
          <Lock className="w-3.5 h-3.5" />
          Admin Panel
        </Link>
      </header>

      {/* FORM */}
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border">
          <h2 className="text-2xl font-bold text-slate-900">
            Create Digital Card
          </h2>

          <p className="text-xs text-slate-500 mt-1 mb-8">
            Generate a self-contained QR code that can be scanned from any
            phone.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Pratik Modak"
                required
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
              />
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Designation / Role
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Director"
                required
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="pratik@aaryansgroup.org"
                required
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({
                    ...formData,
                    phone: value,
                  });
                }}
                maxLength={10}
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                placeholder="9876543210"
                required
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Address
              </label>
              <textarea
                name="address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                placeholder="Level 9, A Wing Part, Tower B1..."
                required
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#5B1B20] hover:bg-[#732328] text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5 text-[#E2BA6E]" />
              Generate QR Code
            </button>
          </form>
        </div>
      </div>

      {/* QR POPUP */}
      {qrUrl && generatedCard && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center relative my-8">
            <button
              onClick={() => setQrUrl("")}
              className="absolute right-4 top-4 text-slate-400"
            >
              <X />
            </button>

            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold">QR Code Generated!</h3>

            <p className="text-xs text-slate-500 mt-2 mb-5">
              Scan this QR code from any phone.
            </p>

            <div className="bg-slate-50 p-5 rounded-2xl border flex justify-center">
              <QRCodeSVG
                value={qrUrl}
                size={230}
                level="H"
                includeMargin={true}
              />
            </div>

            <a
              href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
                generateVCard(generatedCard),
              )}`}
              download={`${generatedCard.fullName}.vcf`}
              className="mt-5 w-full bg-[#E2BA6E] hover:bg-[#d4a94f] text-[#5B1B20] py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition"
            >
              <Download className="w-4 h-4 text-[#5B1B20]" />
              Save Contact
            </a>

            <button
              onClick={() => setQrUrl("")}
              className="mt-2 w-full bg-slate-100 py-3 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PUBLIC CARD PAGE
   ========================================================= */

function PublicCardView({ cards }) {
  const { id } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams(window.location.search);
      const encodedData = params.get("data");

      // URLSearchParams.get() already decodes the value,
      // so do NOT call decodeURIComponent() here.
      if (encodedData) {
        try {
          const qrCard = JSON.parse(encodedData);

          if (qrCard && String(qrCard.id) === String(id)) {
            setCard(qrCard);
            setLoading(false);
            return;
          }

          console.warn("QR card ID does not match route ID.");
        } catch (qrError) {
          console.error("QR data JSON error:", qrError);
        }
      }

      // Same-device fallback for cards created before the new QR format.
      try {
        const savedCards = localStorage.getItem("app_business_cards");

        if (savedCards) {
          const localCards = JSON.parse(savedCards);
          const localCard = localCards.find(
            (item) => String(item.id) === String(id),
          );

          if (localCard) {
            setCard(localCard);
            setLoading(false);
            return;
          }
        }
      } catch (storageError) {
        console.error("Local card read error:", storageError);
      }

      setError("Card Not Found");
      setLoading(false);
    } catch (err) {
      console.error("Public card error:", err);
      setError("Card Not Found");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f0e5] flex items-center justify-center px-5">
        <div className="bg-white rounded-[35px] shadow-xl p-10 text-center max-w-xl w-full">
          <div className="w-12 h-12 border-4 border-[#E2BA6E] border-t-[#5B1B20] rounded-full animate-spin mx-auto mb-5" />
          <h1 className="text-xl font-bold text-[#321b1e]">
            Loading Business Card...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#f7f0e5] flex items-center justify-center px-5">
        <div className="bg-white rounded-[35px] shadow-xl p-10 text-center max-w-xl w-full">
          <div className="text-6xl mb-5">⚠️</div>

          <h1 className="text-3xl font-bold text-[#321b1e] mb-4">
            Card Not Found
          </h1>

          <p className="text-gray-500 text-lg">
            This QR code does not contain a valid business card.
          </p>

          <p className="text-sm text-gray-400 mt-5">
            Please create a new QR code from the latest deployed website.
          </p>

          <Link
            to="/"
            className="inline-flex mt-6 px-6 py-3 rounded-xl bg-[#5B1B20] text-white font-bold"
          >
            Create New Card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f0e5] py-8 px-4">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <ExactBusinessCard card={card} />

        <div className="text-center mt-6">
          <button
            onClick={() => {
              const vcard = generateVCard(card);

              const blob = new Blob([vcard], {
                type: "text/vcard;charset=utf-8",
              });

              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");

              link.href = url;
              link.download = `${card.fullName || "business-card"}.vcf`;

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              URL.revokeObjectURL(url);
            }}
            className="px-7 py-3 rounded-full bg-[#E2BA6E] text-[#5B1B20] font-bold shadow-lg hover:bg-[#d4a94f] transition"
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN PANEL
   ========================================================= */

function AdminPanel({
  cards,
  setCards,
  adminCreds,
  setAdminCreds,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [search, setSearch] = useState("");
  const [viewCard, setViewCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [success, setSuccess] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [newUsername, setNewUsername] = useState(adminCreds.username);
  const [newPassword, setNewPassword] = useState(adminCreds.password);

  const navigate = useNavigate();

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  /* LOGIN */
  const login = (e) => {
    e.preventDefault();

    if (username === adminCreds.username && password === adminCreds.password) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_session", "true");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  /* LOGOUT */
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_session");
    navigate("/");
  };

  /* LOGIN SCREEN */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <div className="flex justify-center mb-5">
            <img src={aaryansLogo} alt="Aaryans" className="h-14" />
          </div>

          <div className="w-14 h-14 bg-[#5B1B20]/10 text-[#5B1B20] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-center">
            Admin Authentication
          </h2>

          {loginError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2">
              <ShieldAlert className="w-4 h-4" />
              Invalid username or password.
            </div>
          )}

          <form onSubmit={login} className="space-y-4 mt-6">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-xl text-sm"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-xl text-sm"
              />
            </div>

            <button className="w-full bg-[#5B1B20] text-white py-3 rounded-xl font-bold text-sm">
              Login to Admin Panel
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-5">
            Default: admin / admin123
          </p>

          <Link
            to="/"
            className="mt-5 flex justify-center items-center gap-1 text-xs text-slate-500"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Public
          </Link>
        </div>
      </div>
    );
  }

  /* FILTER */
  const filteredCards = cards.filter(
    (card) =>
      card.fullName.toLowerCase().includes(search.toLowerCase()) ||
      card.email.toLowerCase().includes(search.toLowerCase()),
  );

  /* EDIT */
  const saveEdit = (e) => {
    e.preventDefault();

    if (!/^[6-9][0-9]{9}$/.test(editingCard.phone)) {
      showSuccess("Phone must contain 10 valid digits.");
      return;
    }

    setCards((previous) =>
      previous.map((card) => (card.id === editingCard.id ? editingCard : card)),
    );

    setEditingCard(null);
    showSuccess("Card details updated successfully!");
  };

  /* DELETE */
  const deleteCard = (id) => {
    setCards((previous) => previous.filter((card) => card.id !== id));
    showSuccess("Card deleted successfully!");
  };

  /* UPDATE CREDENTIALS */
  const updateCredentials = (e) => {
    e.preventDefault();

    setAdminCreds({
      username: newUsername,
      password: newPassword,
    });

    setShowSettings(false);
    showSuccess("Admin credentials updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* SUCCESS */}
      {success && (
        <div className="fixed top-6 right-6 z-[100] bg-white border border-[#E2BA6E] shadow-2xl rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-bold text-sm">Changes Saved</p>
            <p className="text-xs text-slate-500">{success}</p>
          </div>
          <button onClick={() => setSuccess("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ADMIN HEADER */}
      <header className="bg-[#5B1B20] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src={aaryansLogo} alt="Aaryans" className="h-10" />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#E2BA6E] text-black text-[10px] font-black px-2 py-1 rounded">
                ADMIN
              </span>
              <h1 className="font-bold">Digital Card Database</h1>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="text-xs bg-black/20 px-3 py-2 rounded-xl text-amber-200 flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" />
            Credentials
          </button>

          <button
            onClick={logout}
            className="text-xs bg-red-600 px-3 py-2 rounded-xl flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* DATABASE */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-white p-5 rounded-2xl border shadow-sm mb-6 flex justify-between items-center">
          <div className="relative w-80 max-w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm"
            />
          </div>

          <div className="text-xs text-slate-500">
            Total:
            <b className="ml-1 text-slate-900">{cards.length}</b>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Contact</th>
                  <th className="p-4 text-center">QR</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCards.map((card) => (
                  <tr key={card.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      <b>{card.fullName}</b>
                      <div className="text-xs text-slate-500">{card.title}</div>
                    </td>

                    <td className="p-4 text-xs">
                      <div>{card.email}</div>
                      <div className="text-slate-500">+91 {card.phone}</div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-block">
                        <QRCodeSVG
                          value={createCardUrl(card)}
                          size={70}
                          level="H"
                        />
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setViewCard(card)}
                        className="p-2 text-slate-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setEditingCard({ ...card })}
                        className="p-2 text-amber-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteCard(card.id)}
                        className="p-2 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCards.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-400">
                      No cards found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewCard && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewCard(null)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-6">Digital Card Preview</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                <ExactBusinessCard card={viewCard} />
              </div>

              <div className="flex flex-col items-center justify-center">
                <QRCodeSVG
                  value={createCardUrl(viewCard)}
                  size={200}
                  level="H"
                  includeMargin
                />
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Scan this QR from any device.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCard && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setEditingCard(null)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-5">Edit Card</h2>

            <form onSubmit={saveEdit} className="space-y-4">
              <input
                value={editingCard.fullName}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, fullName: e.target.value })
                }
                placeholder="Full Name"
                required
                className="w-full border rounded-xl p-3 text-sm"
              />

              <input
                value={editingCard.title}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, title: e.target.value })
                }
                placeholder="Designation"
                required
                className="w-full border rounded-xl p-3 text-sm"
              />

              <input
                type="email"
                value={editingCard.email}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, email: e.target.value })
                }
                placeholder="Email"
                required
                className="w-full border rounded-xl p-3 text-sm"
              />

              <input
                value={editingCard.phone}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                maxLength={10}
                inputMode="numeric"
                placeholder="Phone"
                required
                className="w-full border rounded-xl p-3 text-sm"
              />

              <textarea
                value={editingCard.address}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, address: e.target.value })
                }
                rows="4"
                placeholder="Address"
                required
                className="w-full border rounded-xl p-3 text-sm"
              />

              <button
                type="submit"
                className="w-full bg-[#5B1B20] text-white py-3 rounded-xl font-bold text-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREDENTIALS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="font-bold text-lg mb-5">Update Admin Credentials</h2>

            <form onSubmit={updateCredentials} className="space-y-4">
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full border rounded-xl p-3 text-sm"
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full border rounded-xl p-3 text-sm"
              />

              <button
                type="submit"
                className="w-full bg-[#5B1B20] text-white py-3 rounded-xl font-bold text-sm"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
