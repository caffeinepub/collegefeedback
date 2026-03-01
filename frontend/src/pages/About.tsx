import React from "react";
import { Link } from "@tanstack/react-router";

const FEATURES = [
  {
    emoji: "🎓",
    title: "Student-First",
    desc: "Every post is written by a real student sharing genuine experiences from their college journey.",
  },
  {
    emoji: "🔒",
    title: "Decentralized & Secure",
    desc: "Built on the Internet Computer Protocol — your data is stored on-chain, censorship-resistant.",
  },
  {
    emoji: "🤝",
    title: "College Connect",
    desc: "Share tips across colleges and learn from students at different institutions.",
  },
  {
    emoji: "📌",
    title: "Wishlist",
    desc: "Bookmark posts that resonate with you and revisit them anytime.",
  },
];

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-10 shadow-md">
        <img
          src="/assets/generated/about-campus-banner.dim_1200x400.png"
          alt="College campus"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ background: "oklch(0.55 0.08 50 / 0.45)" }}
        >
          <h1
            className="font-brand text-3xl sm:text-4xl mb-2 drop-shadow-sm"
            style={{ color: "oklch(0.99 0.005 58)" }}
          >
            Memu నేర్చుకున్నవి
          </h1>
          <p
            className="text-sm sm:text-base font-medium drop-shadow-sm"
            style={{ color: "oklch(0.97 0.010 58)" }}
          >
            మేము నేర్చుకున్నవి — What We Learned
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="mb-10">
        <h2
          className="font-heading text-2xl font-bold mb-4"
          style={{ color: "oklch(0.35 0.08 48)" }}
        >
          Our Mission
        </h2>
        <p className="text-base leading-relaxed mb-3" style={{ color: "oklch(0.38 0.04 50)" }}>
          College is full of lessons that no textbook teaches — the internship that changed
          everything, the hackathon that pushed your limits, the course that opened new doors.
          <strong style={{ color: "oklch(0.45 0.10 42)" }}> Memu నేర్చుకున్నవి</strong> is a
          platform where students share these real experiences so others can learn, grow, and
          navigate college life better.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "oklch(0.38 0.04 50)" }}>
          Whether you're a fresher looking for guidance or a final-year student wanting to give
          back — this is your space.
        </p>
      </section>

      {/* Features */}
      <section className="mb-10">
        <h2
          className="font-heading text-2xl font-bold mb-6"
          style={{ color: "oklch(0.35 0.08 48)" }}
        >
          What Makes Us Different
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border p-5"
              style={{
                background: "oklch(0.97 0.015 60)",
                borderColor: "oklch(0.88 0.025 55)",
              }}
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3
                className="font-heading font-bold text-base mb-1"
                style={{ color: "oklch(0.38 0.07 48)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.48 0.04 50)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* College Connect */}
      <section
        className="rounded-2xl border p-6 mb-10"
        style={{
          background: "oklch(0.95 0.025 58)",
          borderColor: "oklch(0.85 0.030 55)",
        }}
      >
        <h2
          className="font-heading text-xl font-bold mb-3"
          style={{ color: "oklch(0.38 0.08 48)" }}
        >
          🤝 College Connect
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.42 0.04 50)" }}>
          College Connect lets students from different colleges share quick tips — about
          placements, campus life, study strategies, and more. It's cross-campus wisdom in
          bite-sized form.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{
            background: "oklch(0.55 0.12 42)",
            color: "oklch(0.99 0.005 58)",
          }}
        >
          Explore College Connect →
        </Link>
      </section>

      {/* ICP */}
      <section
        className="rounded-2xl border p-6"
        style={{
          background: "oklch(0.94 0.020 200)",
          borderColor: "oklch(0.82 0.030 200)",
        }}
      >
        <h2
          className="font-heading text-xl font-bold mb-3"
          style={{ color: "oklch(0.32 0.10 200)" }}
        >
          🌐 Built on Internet Computer
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "oklch(0.38 0.06 200)" }}>
          This platform runs entirely on the Internet Computer Protocol (ICP) — a decentralized
          blockchain network. Your posts and data are stored on-chain, ensuring transparency,
          permanence, and censorship-resistance without relying on traditional cloud servers.
        </p>
      </section>
    </div>
  );
};

export default About;
