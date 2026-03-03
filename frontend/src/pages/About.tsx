import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BookOpen, Users, Lightbulb, Heart, ArrowRight } from 'lucide-react';
import ShareWebsiteButtons from '../components/ShareWebsiteButtons';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Share Experiences',
    description: 'Post your college journey — internships, hackathons, courses, and general advice for fellow students.',
  },
  {
    icon: Users,
    title: 'Connect with Peers',
    description: 'Find students from your year and college who are open to DMs and peer mentorship.',
  },
  {
    icon: Lightbulb,
    title: 'Discover Wisdom',
    description: 'Browse curated tips filtered by category and college year to find what matters most to you.',
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'Built by students, for students. Every post is a real experience shared to help others grow.',
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight mb-4 leading-none">
          <span className="italic text-violet-600">MEMU</span>
          <span className="text-neutral-900">NERCHUKNNAVI</span>
        </h1>
        <p className="text-xl text-neutral-500 font-medium mb-2">మేము నేర్చుకున్నవి</p>
        <p className="text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
          "What we learned" — A collective wisdom hub for college students to help each other grow.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8 shadow-card">
        <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-4">Our Mission</h2>
        <p className="text-neutral-600 leading-relaxed mb-4">
          College is full of lessons that no textbook teaches. Memu Nerchukunnavi (మేము నేర్చుకున్నవి)
          is a platform where students share real experiences — the internships they landed, the
          hackathons they competed in, the courses that changed their perspective, and the general
          wisdom they wish someone had told them earlier.
        </p>
        <p className="text-neutral-600 leading-relaxed">
          Every post is a gift from one student to another. Together, we build a collective memory
          of what college life really teaches us.
        </p>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card hover:border-violet-200 transition-colors">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
              <Icon size={20} className="text-violet-600" />
            </div>
            <h3 className="font-heading font-bold text-neutral-900 mb-2">{title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center mb-10">
        <button
          onClick={() => navigate({ to: '/share' })}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all duration-200 shadow-violet"
        >
          Share Your Experience <ArrowRight size={18} />
        </button>
      </section>

      {/* Share */}
      <div className="flex justify-center">
        <ShareWebsiteButtons />
      </div>
    </div>
  );
}
