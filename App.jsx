import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "moral", label: "Moral", emoji: "⚖️", color: "#e8c96e" },
  { id: "sosial", label: "Sosial", emoji: "👥", color: "#7eb8e8" },
  { id: "survival", label: "Survival", emoji: "🔥", color: "#e87e7e" },
  { id: "hidup", label: "Hidup", emoji: "🌱", color: "#7ee8a2" },
  { id: "random", label: "Random", emoji: "🎲", color: "#c47ee8" },
];

const DILEMMAS = {
  moral: [
    {
      q: "Kamu menemukan dompet berisi Rp500.000 di jalan sepi. Tidak ada identitas pemilik.",
      a: "Ambil uangnya, mungkin memang rezkimu",
      b: "Titipkan ke kantor polisi terdekat",
      insight: "73% orang memilih A, tapi hanya 12% yang mengakuinya di depan umum.",
    },
    {
      q: "Sahabatmu baru saja melamar orang yang menurutmu tidak cocok untuknya. Dia minta pendapatmu.",
      a: "Jujur bilang kekhawatiranmu",
      b: "Dukung saja karena itu hidupnya",
      insight: "Kejujuran yang menyakitkan vs kebaikan yang membohongi.",
    },
    {
      q: "Kamu tahu rekanmu curang dalam ujian penting. Dosen menanyaimu secara langsung.",
      a: "Bilang yang sebenarnya",
      b: "Diam, itu bukan urusanmu",
      insight: "Loyalitas dan integritas jarang bisa berdampingan.",
    },
    {
      q: "Kamu bisa selamatkan 1000 orang asing atau 1 orang yang kamu cintai.",
      a: "1000 orang asing",
      b: "1 orang yang kamu cintai",
      insight: "Utilitarisme vs ikatan emosional. Filsuf pun tidak sepakat.",
    },
  ],
  sosial: [
    {
      q: "Kamu diundang temanmu ke acara yang sebenarnya tidak ingin kamu datangi. Temanmu akan kecewa jika kamu tidak datang.",
      a: "Paksakan diri hadir",
      b: "Tolak dengan jujur",
      insight: "Social battery itu nyata. Tapi begitu juga rasa kesepian orang lain.",
    },
    {
      q: "Di grup chat ada gosip tentang seseorang yang kamu kenal. Informasinya sebagian benar.",
      a: "Luruskan informasinya",
      b: "Diam saja",
      insight: "Diam bisa berarti persetujuan. Bicara bisa berarti drama.",
    },
    {
      q: "Mantanmu kesulitan secara finansial. Kamu masih menyimpan nomornya.",
      a: "Hubungi dan tawarkan bantuan",
      b: "Jaga jarak karena hubungan sudah selesai",
      insight: "Batas antara kepedulian dan membuka luka lama sangat tipis.",
    },
  ],
  survival: [
    {
      q: "Kamu ditempatkan di pulau terpencil selama 30 hari tanpa listrik. Kamu mau bawa satu barang apa?",
      a: "Pisau survival",
      b: "Kotak P3K lengkap",
      insight: "Pisau bisa membuat api. P3K tidak bisa berburu.",
    },
    {
      q: "Zombie apocalypse. Ada kelompok besar yang minta bergabung, tapi sumber daya terbatas.",
      a: "Terima mereka, karena banyak orang = lebih kuat",
      b: "Tolak. sumber daya sudah pas-pasan",
      insight: "Dalam krisis nyata, keputusan ini menentukan siapa yang bertahan.",
    },
    {
      q: "Kamu harus berjalan 40 km atau menunggu 3 hari di tempat berbahaya untuk dijemput.",
      a: "Jalan sekarang",
      b: "Tunggu penjemputan",
      insight: "Action vs patience. Keduanya bisa benar atau fatal.",
    },
  ],
  hidup: [
    {
      q: "Kamu ditawari pekerjaan impian di luar kota, tapi harus tinggalkan semua orang yang kamu sayang.",
      a: "Ambil peluangnya",
      b: "Tetap di sini, tunggu kesempatan lain",
      insight: "Penyesalan karena pergi vs penyesalan karena tidak pergi.",
    },
    {
      q: "Kamu punya Rp100 juta. Tabung untuk masa depan atau gunakan untuk pengalaman sekali seumur hidup?",
      a: "Tabung dan investasi",
      b: "Beli pengalaman yang tak terlupakan",
      insight: "Riset menunjukkan pengalaman memberi kebahagiaan lebih lama daripada benda.",
    },
    {
      q: "Hidup nyaman tapi biasa-biasa saja, atau hidup penuh gejolak tapi penuh makna?",
      a: "Nyaman dan stabil",
      b: "Bergejolak tapi bermakna",
      insight: "Mayoritas memilih B secara teori. Mayoritas memilih A secara praktik.",
    },
    {
      q: "Kamu bisa tahu tanggal kematianmu sendiri. Mau tahu?",
      a: "Ya, biar bisa bersiap",
      b: "Tidak, biarkan misterius",
      insight: "Apakah pengetahuan selalu membebaskan?",
    },
  ],
  random: [
    {
      q: "Kamu harus makan satu makanan yang sama setiap hari seumur hidup.",
      a: "Nasi + telur goreng",
      b: "Mie instan rasa apapun",
      insight: "Pertanyaan ini lebih serius dari kelihatannya.",
    },
    {
      q: "Kalau punya kekuatan super",
      a: "Terbang bebas tapi semua orang tau",
      b: "Baca pikiran orang lain tapi tidak ada yang tau",
      insight: "Kebebasan vs pengetahuan. Keduanya ada harganya.",
    },
    {
      q: "Kamu bisa hapus satu memori burukmu selamanya, tapi juga kehilangan pelajaran dari sana.",
      a: "Hapus saja, terlalu menyakitkan",
      b: "Simpan, itu bagian dari dirimu",
      insight: "Trauma membentuk, tapi tidak harus mendefinisikan.",
    },
    {
      q: "Pilih dunia mu!",
      a: "Semua orang bisa membaca pikiranku",
      b: "Aku bisa membaca pikiran semua orang",
      insight: "Keduanya terdengar mengerikan dengan caranya masing-masing.",
    },
  ],
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&display=swap');`;

export default function Dilemma() {
  const [screen, setScreen] = useState("home"); // home | category | question | result | recap
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState({ a: 0, b: 0 });
  const [animating, setAnimating] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #0c0b0e; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      @keyframes slideLeft { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-60px); } }
      @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(232,201,110,0.3); } 50% { box-shadow: 0 0 0 12px rgba(232,201,110,0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  function startCategory(cat) {
    const pool = [...DILEMMAS[cat.id]].sort(() => Math.random() - 0.5).slice(0, 3);
    setSelectedCategory(cat);
    setQuestions(pool);
    setCurrentQ(0);
    setAnswers([]);
    setScore({ a: 0, b: 0 });
    setChosen(null);
    setScreen("question");
  }

  function handleChoice(choice) {
    if (chosen) return;
    setChosen(choice);
    const q = questions[currentQ];
    setScore(prev => ({ ...prev, [choice]: prev[choice] + 1 }));
    setAnswers(prev => [...prev, { q, choice, text: choice === "a" ? q.a : q.b }]);
  }

  function nextQuestion() {
    if (currentQ + 1 >= questions.length) {
      setScreen("recap");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentQ(prev => prev + 1);
      setChosen(null);
      setAnimating(false);
    }, 350);
  }

  const cat = selectedCategory;
  const progress = questions.length > 0 ? ((currentQ) / questions.length) * 100 : 0;

  // ─── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: "#0c0b0e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", fontFamily: "'DM Mono', monospace" }}>
      <div style={{ textAlign: "center", animation: "fadeUp 0.8s ease both", maxWidth: 460 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#5a5660", textTransform: "uppercase", marginBottom: 20 }}>selamat datang di</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(52px, 12vw, 80px)", fontWeight: 900, color: "#f0ece4", lineHeight: 0.9, marginBottom: 8 }}>
          Dilemma<span style={{ color: "#e8c96e" }}>ly</span>
        </h1>
        <div style={{ width: 60, height: 2, background: "#e8c96e", margin: "20px auto" }} />
        <p style={{ color: "#8a8590", fontSize: 13, lineHeight: 1.8, marginBottom: 40 }}>
          Tidak ada jawaban benar atau salah.<br />
          Hanya cermin dari siapa dirimu.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {CATEGORIES.slice(0, 4).map((c, i) => (
            <button key={c.id} onClick={() => startCategory(c)}
              style={{ background: "#16141a", border: `1px solid #2a2730`, borderRadius: 12, padding: "16px 12px", cursor: "pointer", transition: "all 0.2s", animation: `fadeUp 0.6s ${0.1 * i}s ease both`, animationFillMode: "backwards", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.background = "#1e1b24"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2730"; e.currentTarget.style.background = "#16141a"; }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</div>
              <div style={{ color: c.color, fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>{c.label}</div>
            </button>
          ))}
        </div>
        <button onClick={() => startCategory(CATEGORIES[4])}
          style={{ width: "100%", background: "#16141a", border: `1px solid #2a2730`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12, animation: "fadeUp 0.6s 0.5s ease both", animationFillMode: "backwards" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#c47ee8"; e.currentTarget.style.background = "#1e1b24"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2730"; e.currentTarget.style.background = "#16141a"; }}>
          <span style={{ fontSize: 22 }}>{CATEGORIES[4].emoji}</span>
          <span style={{ color: "#c47ee8", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>{CATEGORIES[4].label}</span>
        </button>
      </div>
    </div>
  );

  // ─── QUESTION ─────────────────────────────────────────────────────────────
  if (screen === "question") {
    const q = questions[currentQ];
    return (
      <div style={{ minHeight: "100vh", background: "#0c0b0e", display: "flex", flexDirection: "column", padding: "24px 20px", fontFamily: "'DM Mono', monospace", maxWidth: 480, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#5a5660", cursor: "pointer", fontSize: 12, letterSpacing: 2 }}>← KELUAR</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>{cat.emoji}</span>
            <span style={{ color: cat.color, fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>{cat.label}</span>
          </div>
          <span style={{ color: "#5a5660", fontSize: 11 }}>{currentQ + 1}/{questions.length}</span>
        </div>

        {/* Progress */}
        <div style={{ height: 2, background: "#1e1b24", borderRadius: 99, marginBottom: 32 }}>
          <div style={{ height: "100%", background: cat.color, borderRadius: 99, width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>

        {/* Card */}
        <div ref={cardRef} style={{ flex: 1, display: "flex", flexDirection: "column", animation: animating ? "slideLeft 0.35s ease forwards" : "fadeUp 0.5s ease both" }}>
          <div style={{ background: "#111019", border: "1px solid #1e1b24", borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a5660", textTransform: "uppercase", marginBottom: 16 }}>DILEMA #{currentQ + 1}</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(17px, 4vw, 22px)", color: "#f0ece4", lineHeight: 1.6, fontWeight: 400 }}>{q.q}</p>
          </div>

          {/* Choices */}
          {!chosen ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["a", "b"].map(c => (
                <button key={c} onClick={() => handleChoice(c)}
                  style={{ background: "#111019", border: "1px solid #2a2730", borderRadius: 14, padding: "20px 22px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", gap: 14, alignItems: "flex-start" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.background = "#181620"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2730"; e.currentTarget.style.background = "#111019"; }}>
                  <span style={{ background: "#1e1b24", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: cat.color, fontWeight: 500, letterSpacing: 1, flexShrink: 0 }}>{c.toUpperCase()}</span>
                  <span style={{ color: "#c8c4d4", fontSize: 14, lineHeight: 1.6 }}>{c === "a" ? q.a : q.b}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["a", "b"].map(c => (
                <div key={c} style={{ background: chosen === c ? "#181620" : "#0e0d12", border: `1px solid ${chosen === c ? cat.color : "#1a1820"}`, borderRadius: 14, padding: "20px 22px", display: "flex", gap: 14, alignItems: "flex-start", opacity: chosen === c ? 1 : 0.4, transition: "all 0.3s" }}>
                  <span style={{ background: chosen === c ? cat.color : "#1e1b24", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: chosen === c ? "#0c0b0e" : "#5a5660", fontWeight: 700, letterSpacing: 1, flexShrink: 0 }}>{c.toUpperCase()}</span>
                  <span style={{ color: chosen === c ? "#f0ece4" : "#5a5660", fontSize: 14, lineHeight: 1.6 }}>{c === "a" ? q.a : q.b}</span>
                </div>
              ))}

              {/* Static Insight */}
              <div style={{ background: "#111019", border: "1px solid #2a2730", borderRadius: 14, padding: "20px 22px", marginTop: 4, animation: "fadeUp 0.4s ease both" }}>
                <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a5660", textTransform: "uppercase", marginBottom: 12 }}>✦ INSIGHT</div>
                <p style={{ color: "#a09aac", fontSize: 13, lineHeight: 1.8, fontStyle: "italic" }}>{q.insight}</p>
              </div>

              <button onClick={nextQuestion} style={{ background: cat.color, border: "none", borderRadius: 12, padding: "16px", cursor: "pointer", color: "#0c0b0e", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 3, fontWeight: 500, textTransform: "uppercase", marginTop: 4, animation: "fadeUp 0.3s 0.1s ease both", animationFillMode: "backwards" }}>
                {currentQ + 1 >= questions.length ? "Lihat Hasil →" : "Dilema Berikutnya →"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RECAP ────────────────────────────────────────────────────────────────
  if (screen === "recap") {
    const totalA = score.a;
    const totalB = score.b;
    const dominant = totalA >= totalB ? "A" : "B";
    const profiles = {
      moral: { A: "Pragmatis yang jujur pada dirinya sendiri.", B: "Idealis yang menjaga kewarasan sosial." },
      sosial: { A: "Pemelihara hubungan, kadang dengan harga dirimu sendiri.", B: "Penjaga batas yang belajar bilang tidak." },
      survival: { A: "Pembuat keputusan cepat di bawah tekanan.", B: "Pemikir strategis yang tidak mudah panik." },
      hidup: { A: "Percaya pada momentum dan leap of faith.", B: "Percaya pada akar dan hal-hal yang bertahan lama." },
      random: { A: "Terbuka pada dunia meski dunia melihat segalanya.", B: "Lebih suka tahu daripada diketahui." },
    };
    const profile = profiles[cat.id]?.[dominant] || "Kepribadianmu tidak mudah dikategorikan.";

    return (
      <div style={{ minHeight: "100vh", background: "#0c0b0e", display: "flex", flexDirection: "column", padding: "32px 20px", fontFamily: "'DM Mono', monospace", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: 5, color: "#5a5660", textTransform: "uppercase", marginBottom: 12 }}>sesi selesai</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#f0ece4", fontWeight: 700, marginBottom: 4 }}>
              {cat.emoji} {cat.label}
            </h2>
            <div style={{ width: 40, height: 2, background: cat.color, margin: "16px auto" }} />
          </div>

          {/* Score */}
          <div style={{ background: "#111019", border: "1px solid #1e1b24", borderRadius: 16, padding: "24px", marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {["a", "b"].map(c => (
              <div key={c} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: dominant.toLowerCase() === c ? cat.color : "#3a3740", fontFamily: "'Playfair Display', serif" }}>{c === "a" ? totalA : totalB}</div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#5a5660", textTransform: "uppercase", marginTop: 4 }}>Pilihan {c.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Profile */}
          <div style={{ background: "#111019", border: `1px solid ${cat.color}33`, borderRadius: 16, padding: "24px", marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: cat.color, textTransform: "uppercase", marginBottom: 12 }}>✦ PROFIL DOMINAN</div>
            <p style={{ color: "#f0ece4", fontSize: 15, lineHeight: 1.8, fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>{profile}</p>
          </div>

          {/* Answers recap */}
          <div style={{ background: "#111019", border: "1px solid #1e1b24", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a5660", textTransform: "uppercase", marginBottom: 16 }}>PILIHAN KAMU</div>
            {answers.map((a, i) => (
              <div key={i} style={{ borderBottom: i < answers.length - 1 ? "1px solid #1e1b24" : "none", paddingBottom: i < answers.length - 1 ? 14 : 0, marginBottom: i < answers.length - 1 ? 14 : 0 }}>
                <div style={{ color: "#5a5660", fontSize: 11, marginBottom: 6 }}>#{i + 1}</div>
                <div style={{ color: "#f0ece4", fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>{a.text}</div>
                <div style={{ display: "inline-block", background: "#1e1b24", padding: "2px 8px", borderRadius: 4, fontSize: 9, letterSpacing: 2, color: cat.color }}>PILIHAN {a.choice.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => startCategory(cat)} style={{ flex: 1, background: "#16141a", border: "1px solid #2a2730", borderRadius: 12, padding: "14px", cursor: "pointer", color: "#c8c4d4", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2 }}>
              Main Lagi
            </button>
            <button onClick={() => setScreen("home")} style={{ flex: 1, background: cat.color, border: "none", borderRadius: 12, padding: "14px", cursor: "pointer", color: "#0c0b0e", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, fontWeight: 500 }}>
              Ganti Kategori
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}