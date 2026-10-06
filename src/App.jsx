import React, { useState, useEffect } from "react";
// Logo lives in src/assets/image.png and this file is in src/
import aaryansLogo from "./assets/image.png";
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
export default function App() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("app_business_cards");
    return saved ? JSON.parse(saved) : [];
  });
  const [adminCreds, setAdminCreds] = useState(() => {
    const saved = localStorage.getItem("admin_credentials");
    return saved
      ? JSON.parse(saved)
      : { username: "admin", password: "admin123" };
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
           {" "}
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
               {" "}
        <Routes>
                    {/* Public Form Route */}         {" "}
          <Route
            path="/"
            element={<PublicFormPage cards={cards} setCards={setCards} />}
          />
                    {/* Public Mobile Card View Route when QR is scanned */}   
               {" "}
          <Route path="/card/:id" element={<PublicCardView cards={cards} />} /> 
                  {/* Secured Admin Panel Route */}         {" "}
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
                 {" "}
        </Routes>
             {" "}
      </div>
         {" "}
    </Router>
  );
}
// Helper to generate vCard string for saving contacts directly to phone contact list
function generateVCard(data) {
  if (!data) return "";
  return `BEGIN:VCARD
VERSION:3.0
FN:${data.fullName || ""}
TITLE:${data.title || ""}
ORG:Aaryans Group of Companies
TEL;TYPE=CELL:${data.phone || ""}
EMAIL:${data.email || ""}
ADR;TYPE=WORK:;;${(data.address || "").replace(/\n/g, ", ")}
URL:https://www.aaryans.group
END:VCARD`;
}
// -------------------------------------------------------------
// EXACT BUSINESS CARD COMPONENT
// -------------------------------------------------------------
function ExactBusinessCard({ card }) {
  if (!card) return null;
  return (
    <div className="w-[340px] bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 relative font-sans">
            {/* Top Dark Red Header Block */}     {" "}
      <div className="bg-[#5B1B20] text-white pt-8 pb-16 px-6 text-center rounded-b-[2rem] relative shadow-md flex flex-col items-center justify-center">
                {/* LOGO (imported from src/assets/image.png) */}       {" "}
        <img
          src={aaryansLogo}
          alt="आर्यन्स"
          className="h-14 w-auto object-contain mb-2 drop-shadow"
        />
               {" "}
        <p className="text-[#E2BA6E] text-xs font-semibold tracking-wide">
                    Aaryans Group of Companies        {" "}
        </p>
             {" "}
      </div>
            {/* Floating White Name Rectangle */}     {" "}
      <div className="px-6 -mt-12 relative z-10">
               {" "}
        <div className="bg-white rounded-2xl shadow-xl py-6 px-4 text-center border border-slate-100/80">
                   {" "}
          <h1 className="text-xl font-extrabold text-[#5B1B20] tracking-wider uppercase min-h-[1.75rem]">
                        {card.fullName}         {" "}
          </h1>
                   {" "}
          <p className="text-slate-600 font-medium text-sm mt-1.5 min-h-[1.25rem]">
                        {card.title}         {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
            {/* Contact Details List */}     {" "}
      <div className="p-7 space-y-4 text-xs font-medium text-slate-700">
               {" "}
        {card.email && (
          <a
            href={`mailto:${card.email}`}
            className="flex items-center gap-3.5 hover:text-[#5B1B20] transition"
          >
                        <Mail className="w-4 h-4 text-[#5B1B20] shrink-0" />   
                   {" "}
            <span className="break-all font-semibold text-slate-800">
                            {card.email}           {" "}
            </span>
                     {" "}
          </a>
        )}
               {" "}
        {card.phone && (
          <a
            href={`tel:${card.phone}`}
            className="flex items-center gap-3.5 hover:text-[#5B1B20] transition"
          >
                        <Phone className="w-4 h-4 text-[#5B1B20] shrink-0" />   
                   {" "}
            <span className="font-semibold text-slate-800">{card.phone}</span> 
                   {" "}
          </a>
        )}
               {" "}
        {card.address && (
          <div className="flex items-start gap-3.5">
                       {" "}
            <MapPin className="w-4 h-4 text-[#5B1B20] shrink-0 mt-0.5" />       
               {" "}
            <span className="leading-relaxed whitespace-pre-line text-slate-700 font-medium">
                            {card.address}           {" "}
            </span>
                     {" "}
          </div>
        )}
                {/* Website fixed at bottom */}       {" "}
        <a
          href="https://www.aaryans.group"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3.5 hover:text-[#5B1B20] transition"
        >
                    <Globe className="w-4 h-4 text-[#5B1B20] shrink-0" />       
           {" "}
          <span className="font-semibold text-slate-800">
                        www.aaryans.group          {" "}
          </span>
                 {" "}
        </a>
             {" "}
      </div>
         {" "}
    </div>
  );
}
// -------------------------------------------------------------
// 1. PUBLIC FORM PAGE (CLEAN & MINIMAL)
// -------------------------------------------------------------
function PublicFormPage({ cards, setCards }) {
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    address: "",
  });
  const [generatedQRUrl, setGeneratedQRUrl] = useState(null);
  const [generatedCardData, setGeneratedCardData] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newId =
      formData.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
      "-" +
      Date.now().toString().slice(-4); // Automatically bind company and default details
    const newCard = {
      ...formData,
      id: newId,
      headerText: "आर्यन्स",
      company: "Aaryans Group of Companies",
      website: "www.aaryans.group",
      createdAt: new Date().toLocaleDateString(),
    };
    setCards([newCard, ...cards]);
    setGeneratedCardData(newCard);
    const publicCardUrl = `${window.location.origin}/card/${newId}`;
    setGeneratedQRUrl(publicCardUrl);
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}     {" "}
      <header className="bg-[#5B1B20] text-white py-4 px-6 shadow-lg flex justify-between items-center sticky top-0 z-40">
               {" "}
        <div className="flex items-center space-x-3">
                   {" "}
          <img
            src={aaryansLogo}
            alt="Aaryans"
            className="h-10 w-auto object-contain"
          />
                   {" "}
          <div>
                       {" "}
            <h1 className="font-bold text-lg leading-tight tracking-wide">
                            Aaryans Digital Portal            {" "}
            </h1>
                       {" "}
            <p className="text-[10px] text-amber-200">
                            Business Card & QR Studio            {" "}
            </p>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <Link
          to="/admin"
          className="text-xs bg-black/20 hover:bg-black/40 text-amber-200 border border-amber-300/30 px-3.5 py-2 rounded-xl flex items-center gap-2 transition"
        >
                    <Lock className="w-3.5 h-3.5" /> Admin Panel        {" "}
        </Link>
             {" "}
      </header>
            {/* Main Form */}     {" "}
      <div className="max-w-xl mx-auto my-10 px-4 w-full flex-1">
               {" "}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200/80">
                   {" "}
          <div className="mb-8 border-b pb-4">
                       {" "}
            <h2 className="text-2xl font-bold text-slate-900">
                            Create Digital Card            {" "}
            </h2>
                       {" "}
            <p className="text-xs text-slate-500 mt-1">
                            Enter details to generate your scannable digital
              vCard QR code.            {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <form onSubmit={handleSubmit} className="space-y-5">
                       {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           {" "}
              <div className="md:col-span-2">
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Full Name                {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none transition"
                />
                             {" "}
              </div>
                           {" "}
              <div className="md:col-span-2">
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Designation / Role                {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Director / Sales Manager"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none transition"
                />
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Email Address                {" "}
                </label>
                               {" "}
                <input
                  type="email"
                  name="email"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none transition"
                />
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Phone Number                {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({
                      ...formData,
                      phone: value.slice(0, 10),
                    });
                  }}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none transition"
                />
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Address              {" "}
              </label>
                           {" "}
              <textarea
                name="address"
                rows="3"
                placeholder="Enter office / residential address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none transition"
              />
                         {" "}
            </div>
                       {" "}
            <button
              type="submit"
              className="w-full mt-6 bg-[#5B1B20] hover:bg-[#732328] text-white py-3.5 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
                            <QrCode className="w-5 h-5 text-[#E2BA6E]" />{" "}
              Generate QR Code            {" "}
            </button>
                     {" "}
          </form>
                 {" "}
        </div>
             {" "}
      </div>
            {/* MODAL POPUP WITH GENERATED QR CODE */}     {" "}
      {generatedQRUrl && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                   {" "}
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 text-center shadow-2xl border border-slate-100 relative">
                       {" "}
            <button
              onClick={() => setGeneratedQRUrl(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
                            <X className="w-5 h-5" />           {" "}
            </button>
                       {" "}
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <Check className="w-10 h-10" strokeWidth={3} />     
                   {" "}
            </div>
                       {" "}
            <h3 className="text-xl font-bold text-slate-900">
                            QR Code Generated!            {" "}
            </h3>
                       {" "}
            <p className="text-xs text-slate-500 mt-1 mb-5">
                            Scan with a mobile camera to view the digital
              business card.            {" "}
            </p>
                       {" "}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center mb-5 shadow-sm">
                           {" "}
              <QRCodeSVG
                value={generatedQRUrl}
                size={190}
                level="H"
                includeMargin={true}
              />
                         {" "}
            </div>
                       {" "}
            <div className="space-y-2">
                           {" "}
              <a
                href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
                  generateVCard(generatedCardData),
                )}`}
                download={`${generatedCardData?.fullName || "vcard"}_vcard.vcf`}
                className="w-full bg-[#5B1B20] hover:bg-[#732328] text-white text-xs py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow"
              >
                                <Download className="w-4 h-4 text-[#E2BA6E]" />{" "}
                Save Contact (.vcf)              {" "}
              </a>
                           {" "}
              <button
                onClick={() => setGeneratedQRUrl(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2.5 rounded-xl font-semibold transition"
              >
                                Close Window              {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
}
// -------------------------------------------------------------
// 2. PUBLIC MOBILE CARD VIEW (WHEN QR CODE IS SCANNED)
// -------------------------------------------------------------
function PublicCardView({ cards }) {
  const { id } = useParams();
  const card = cards.find((c) => c.id === id);
  if (!card) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
               {" "}
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm">
                   {" "}
          <h2 className="text-lg font-bold text-slate-800">Card Not Found</h2> 
                 {" "}
          <p className="text-xs text-slate-500 mt-2">
                        The requested card record does not exist or was removed.
                     {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4">
            <ExactBusinessCard card={card} />     {" "}
      <div className="mt-6 w-[340px]">
               {" "}
        <a
          href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
            generateVCard(card),
          )}`}
          download={`${card.fullName || "contact"}.vcf`}
          className="w-full bg-[#5B1B20] hover:bg-[#732328] text-white py-3.5 rounded-2xl text-center text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
        >
                    <Download className="w-4 h-4 text-[#E2BA6E]" /> Save Contact
          to Phone        {" "}
        </a>
             {" "}
      </div>
         {" "}
    </div>
  );
}
// -------------------------------------------------------------
// 3. SECURED ADMIN PANEL
// -------------------------------------------------------------
function AdminPanel({
  cards,
  setCards,
  adminCreds,
  setAdminCreds,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewCard, setViewCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newUsername, setNewUsername] = useState(adminCreds.username);
  const [newPassword, setNewPassword] = useState(adminCreds.password);
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      usernameInput === adminCreds.username &&
      passwordInput === adminCreds.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_session", "true");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_session");
    navigate("/");
  };
  const handleUpdateCreds = (e) => {
    e.preventDefault();
    setAdminCreds({ username: newUsername, password: newPassword });
    setShowSettingsModal(false);
    alert("Admin Credentials Updated Successfully!");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    setCards(cards.map((c) => (c.id === editingCard.id ? editingCard : c)));

    setEditingCard(null);

    setSuccessMessage("Card details updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleDelete = (id) => {
    // Delete immediately
    setCards(cards.filter((c) => c.id !== id));

    // Show success popup
    setSuccessMessage("Card deleted successfully!");

    // Hide popup after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }; // UN-AUTHENTICATED LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
               {" "}
        <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-slate-100">
                   {" "}
          <div className="w-14 h-14 bg-[#5B1B20]/10 text-[#5B1B20] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <Lock className="w-7 h-7" />         {" "}
          </div>
                   {" "}
          <h2 className="text-xl font-bold text-center text-slate-900">
                        Admin Authentication          {" "}
          </h2>
                   {" "}
          <p className="text-xs text-slate-500 text-center mt-1 mb-6">
                        Enter credentials to access stored submissions.        
             {" "}
          </p>
                   {" "}
          {loginError && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2 font-medium">
                            <ShieldAlert className="w-4 h-4 shrink-0" /> Invalid
              Username or               Password!            {" "}
            </div>
          )}
                   {" "}
          <form onSubmit={handleLogin} className="space-y-4">
                       {" "}
            <div>
                           {" "}
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Username              {" "}
              </label>
                           {" "}
              <div className="relative">
                               {" "}
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                               {" "}
                <input
                  type="text"
                  placeholder="Enter username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none"
                />
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Password              {" "}
              </label>
                           {" "}
              <div className="relative">
                               {" "}
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                               {" "}
                <input
                  type="password"
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none"
                />
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <button
              type="submit"
              className="w-full bg-[#5B1B20] hover:bg-[#732328] text-white py-3 rounded-xl text-sm font-bold transition shadow-lg"
            >
                            Login to Admin Panel            {" "}
            </button>
                     {" "}
          </form>
                   {" "}
          <p className="text-[11px] text-slate-400 text-center mt-5">
                        Default credentials: <br />            Username:{" "}
            <code className="text-slate-700 font-bold">admin</code> |          
              Password:{" "}
            <code className="text-slate-700 font-bold">admin123</code>       
             {" "}
          </p>
                   {" "}
          <div className="mt-5 text-center border-t pt-4">
                       {" "}
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 font-medium"
            >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public
              Form            {" "}
            </Link>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }
  const filteredCards = cards.filter(
    (c) =>
      (c.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  ); // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-slate-100">
           {/* SUCCESS TOAST */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-[100] success-toast">
          <div className="success-toast-inner">
            <div className="success-icon">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="success-content">
              <p className="success-title">Changes Saved</p>

              <p className="success-text">{successMessage}</p>
            </div>

            <button
              onClick={() => setSuccessMessage("")}
              className="success-close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <header className="bg-slate-900 text-white py-4 px-6 shadow-md flex justify-between items-center sticky top-0 z-40">
               {" "}
        <div className="flex items-center space-x-3">
                   {" "}
          <span className="bg-[#E2BA6E] text-slate-900 font-black px-2.5 py-0.5 rounded text-xs tracking-wider uppercase">
                        Admin          {" "}
          </span>
                   {" "}
          <h1 className="font-bold text-base">
                        Digital Card Submissions Database          {" "}
          </h1>
                 {" "}
        </div>
               {" "}
        <div className="flex items-center gap-2">
                   {" "}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
                        <Settings className="w-3.5 h-3.5" /> Credentials        
             {" "}
          </button>
                   {" "}
          <button
            onClick={handleLogout}
            className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-medium"
          >
                        <LogOut className="w-3.5 h-3.5" /> Logout          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </header>
           {" "}
      <div className="max-w-6xl mx-auto py-8 px-4">
               {" "}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
                   {" "}
          <div className="relative w-full sm:w-80">
                       {" "}
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                       {" "}
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-[#5B1B20] outline-none"
            />
                     {" "}
          </div>
                   {" "}
          <div className="text-xs text-slate-500 font-medium">
                        Total Submissions:            {" "}
            <span className="font-bold text-slate-900 text-sm">
                            {cards.length}           {" "}
            </span>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                   {" "}
          <div className="overflow-x-auto">
                       {" "}
            <table className="w-full text-left text-sm">
                           {" "}
              <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider">
                               {" "}
                <tr>
                                    <th className="p-4">Name & Title</th>       
                            <th className="p-4">Contact Info</th>               
                    <th className="p-4 text-center">Mobile QR</th>             
                      <th className="p-4 text-right">Actions</th>             
                   {" "}
                </tr>
                             {" "}
              </thead>
                           {" "}
              <tbody className="divide-y divide-slate-100">
                               {" "}
                {filteredCards.length === 0 ? (
                  <tr>
                                       {" "}
                    <td
                      colSpan="4"
                      className="p-10 text-center text-slate-400 font-medium"
                    >
                                            No card records stored yet.        
                                 {" "}
                    </td>
                                     {" "}
                  </tr>
                ) : (
                  filteredCards.map((card) => {
                    const cardUrl = `${window.location.origin}/card/${card.id}`;
                    return (
                      <tr
                        key={card.id}
                        className="hover:bg-slate-50/80 transition"
                      >
                                               {" "}
                        <td className="p-4">
                                                   {" "}
                          <div className="font-bold text-slate-900">
                                                        {card.fullName}         
                                           {" "}
                          </div>
                                                   {" "}
                          <div className="text-xs text-slate-500 font-medium">
                                                        {card.title}           
                                         {" "}
                          </div>
                                                 {" "}
                        </td>
                                               {" "}
                        <td className="p-4 text-xs space-y-0.5">
                                                   {" "}
                          <div className="font-semibold text-slate-800">
                                                        {card.email}           
                                         {" "}
                          </div>
                                                   {" "}
                          <div className="text-slate-500">{card.phone}</div>   
                                             {" "}
                        </td>
                                               {" "}
                        <td className="p-4 text-center">
                                                   {" "}
                          <div className="inline-block p-1 bg-white border rounded-lg shadow-sm">
                                                       {" "}
                            <QRCodeSVG value={cardUrl} size={40} />             
                                       {" "}
                          </div>
                                                 {" "}
                        </td>
                                               {" "}
                        <td className="p-4 text-right space-x-1">
                                                   {" "}
                          <button
                            onClick={() => setViewCard(card)}
                            className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                            title="View Card Details"
                          >
                                                       {" "}
                            <Eye className="w-4 h-4" />                       
                             {" "}
                          </button>
                                                   {" "}
                          <button
                            onClick={() => setEditingCard(card)}
                            className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition"
                            title="Edit Details"
                          >
                                                       {" "}
                            <Edit className="w-4 h-4" />                       
                             {" "}
                          </button>
                                                   {" "}
                          <button
                            onClick={() => handleDelete(card.id)}
                            className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                            title="Delete Record"
                          >
                                                       {" "}
                            <Trash2 className="w-4 h-4" />                     
                               {" "}
                          </button>
                                                 {" "}
                        </td>
                                             {" "}
                      </tr>
                    );
                  })
                )}
                             {" "}
              </tbody>
                         {" "}
            </table>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
            {/* VIEW PREVIEW MODAL */}     {" "}
      {viewCard && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                   {" "}
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                       {" "}
            <button
              onClick={() => setViewCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
                            <X className="w-5 h-5" />           {" "}
            </button>
                       {" "}
            <h3 className="text-xl font-bold text-slate-900 mb-6">
                            Digital Card Mobile Preview            {" "}
            </h3>
                       {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                           {" "}
              <div className="flex flex-col items-center">
                                <ExactBusinessCard card={viewCard} />           
                 {" "}
              </div>
                           {" "}
              <div className="space-y-6">
                               {" "}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                                   {" "}
                  <QRCodeSVG
                    value={`${window.location.origin}/card/${viewCard.id}`}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                                   {" "}
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                                        Scannable Mobile vCard QR Code          
                           {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border">
                                   {" "}
                  <p>
                                        <strong>Full Name:</strong>{" "}
                    {viewCard.fullName}                 {" "}
                  </p>
                                   {" "}
                  <p>
                                        <strong>Role:</strong> {viewCard.title} 
                                   {" "}
                  </p>
                                   {" "}
                  <p>
                                        <strong>Email:</strong> {viewCard.email}
                                     {" "}
                  </p>
                                   {" "}
                  <p>
                                        <strong>Phone:</strong> {viewCard.phone}
                                     {" "}
                  </p>
                                   {" "}
                  <p>
                                        <strong>Address:</strong>{" "}
                    {viewCard.address}                 {" "}
                  </p>
                                   {" "}
                  <p>
                                        <strong>Website:</strong>{" "}
                    www.aaryans.group                  {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                <button
                  onClick={() => setViewCard(null)}
                  className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl text-xs font-bold transition"
                >
                                    Close Preview                {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
            {/* EDIT MODAL */}     {" "}
      {editingCard && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                   {" "}
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                       {" "}
            <button
              onClick={() => setEditingCard(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
                            <X className="w-5 h-5" />           {" "}
            </button>
                       {" "}
            <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Edit Submitted Details            {" "}
            </h3>
                       {" "}
            <form onSubmit={handleSaveEdit} className="space-y-4">
                           {" "}
              <div>
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Full Name                {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  value={editingCard.fullName}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#5B1B20]"
                />
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Designation                {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  value={editingCard.title}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#5B1B20]"
                />
                             {" "}
              </div>
                           {" "}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               {" "}
                <div>
                                   {" "}
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Email                  {" "}
                  </label>
                                   {" "}
                  <input
                    type="email"
                    value={editingCard.email}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#5B1B20]"
                  />
                                 {" "}
                </div>
                               {" "}
                <div>
                                   {" "}
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Phone                  {" "}
                  </label>
                                   {" "}
                  <input
                    type="text"
                    value={editingCard.phone}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#5B1B20]"
                  />
                                 {" "}
                </div>
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Address                {" "}
                </label>
                               {" "}
                <textarea
                  rows="3"
                  value={editingCard.address}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, address: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#5B1B20]"
                />
                             {" "}
              </div>
                           {" "}
              <div className="flex gap-2 pt-2">
                               {" "}
                <button
                  type="submit"
                  className="flex-1 bg-[#5B1B20] text-white py-2.5 rounded-xl text-xs font-bold"
                >
                                    Save Changes                {" "}
                </button>
                               {" "}
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold"
                >
                                    Cancel                {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </form>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
            {/* CREDENTIALS MODAL */}     {" "}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                   {" "}
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
                       {" "}
            <h3 className="font-bold text-slate-900 mb-2">
                            Update Admin Credentials            {" "}
            </h3>
                       {" "}
            <p className="text-xs text-slate-500 mb-4">
                            Set custom username and password.            {" "}
            </p>
                       {" "}
            <form onSubmit={handleUpdateCreds} className="space-y-4">
                           {" "}
              <div>
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    New Username                {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#5B1B20] outline-none"
                />
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    New Password                {" "}
                </label>
                               {" "}
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#5B1B20] outline-none"
                />
                             {" "}
              </div>
                           {" "}
              <div className="flex gap-2 pt-2">
                               {" "}
                <button
                  type="submit"
                  className="flex-1 bg-[#5B1B20] text-white py-2 rounded-xl text-xs font-bold"
                >
                                    Save                {" "}
                </button>
                               {" "}
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold"
                >
                                    Cancel                {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </form>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
}
