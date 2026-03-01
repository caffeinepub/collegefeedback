import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

const steps = [
  {
    emoji: '1️⃣',
    title: 'Pick Your Year',
    desc: 'Tell us which year you\'re in so we can surface the most relevant advice from students who\'ve been exactly where you are.',
  },
  {
    emoji: '2️⃣',
    title: 'Browse Peer Advice',
    desc: 'Explore real tips from seniors on internships, hackathons, courses, and general campus life — no fluff, just lived experience.',
  },
  {
    emoji: '3️⃣',
    title: 'Share a Lesson',
    desc: 'Learned something the hard way? Share it anonymously in under a minute. No sign-in, no friction — just your wisdom.',
  },
  {
    emoji: '4️⃣',
    title: 'Connect with Peers',
    desc: 'Hit the Connect button on posts that resonate with you. Build a network of students who think like you do.',
  },
];

const values = [
  { emoji: '🎯', title: 'Peer-to-Peer', desc: 'Advice from students who\'ve actually been there — not generic career guides.' },
  { emoji: '🔓', title: 'No Sign-In', desc: 'Zero barriers. Pick your year and start exploring or sharing immediately.' },
  { emoji: '🌱', title: 'Start Early', desc: 'The earlier you discover opportunities, the more time you have to act on them.' },
  { emoji: '🤝', title: 'Community First', desc: 'Every upvote and connection strengthens the network for everyone.' },
];

export default function About() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-10">
      {/* Banner image */}
      <div className="rounded-2xl overflow-hidden mb-12 shadow-card-hover">
        <img
          src="/assets/generated/about-banner.dim_1200x400.png"
          alt="Diverse students on campus"
          className="w-full h-48 sm:h-64 object-cover"
        />
      </div>

      {/* Section 1: What is Memu Nerchukunnavi */}
      <section className="mb-14">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-heading font-semibold px-3 py-1.5 rounded-full mb-4">
          🎓 Our Mission
        </div>
        {/* Brand name in script/cursive font */}
        <h1 className="font-brand text-4xl sm:text-5xl text-foreground mb-2">
          Memu <span className="text-primary">Nerchukunnavi</span> 🎓
        </h1>
        <div className="prose prose-sm max-w-none text-muted-foreground font-body leading-relaxed space-y-4">
          <p className="text-base text-foreground/80">
            Memu Nerchukunnavi is a peer-to-peer campus wisdom platform where students share the lessons they wish they'd known earlier — and help the next generation start sooner.
          </p>
          <p>
            Too much valuable knowledge stays locked in the heads of graduating seniors. The student who discovered a life-changing internship in 1st year, the one who found the perfect course sequence, the one who built a startup at a hackathon — their stories rarely reach the freshers who need them most.
          </p>
          <p>
            We're changing that. Memu Nerchukunnavi is a living, growing library of real student experiences, organized by category and year, accessible to anyone on campus — no sign-in required.
          </p>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="mb-14">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-2">
          How It Works ⚙️
        </h2>
        <p className="text-muted-foreground font-body mb-8">
          Four simple steps to get the most out of Memu Nerchukunnavi.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map(step => (
            <div
              key={step.emoji}
              className="rounded-2xl border border-border bg-card shadow-card p-6 flex flex-col gap-3 hover:shadow-card-hover transition-shadow"
            >
              <div className="text-4xl">{step.emoji}</div>
              <h3 className="font-heading font-bold text-lg text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Why It Matters */}
      <section className="mb-14">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-2">
          Why It Matters 💡
        </h2>
        <p className="text-muted-foreground font-body mb-8 leading-relaxed">
          The gap between students who thrive and those who struggle is often just information. The right advice at the right time can change everything — which internship to apply for, which course to take early, which hackathon to join. Memu Nerchukunnavi exists to close that gap.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {values.map(v => (
            <div
              key={v.emoji}
              className="rounded-xl border border-border bg-primary/5 p-5 flex flex-col gap-2 text-center"
            >
              <div className="text-3xl">{v.emoji}</div>
              <h4 className="font-heading font-semibold text-sm text-foreground">{v.title}</h4>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <blockquote className="border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
          <p className="text-base text-foreground font-body italic leading-relaxed">
            "The best time to learn from a senior was four years ago. The second best time is right now."
          </p>
          <footer className="text-sm text-muted-foreground font-heading font-semibold mt-2">
            — The Memu Nerchukunnavi Community 🎓
          </footer>
        </blockquote>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary shadow-card-hover px-8 py-10 text-center">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="font-brand text-3xl sm:text-4xl text-primary-foreground mb-3">
          Ready to start?
        </h2>
        <p className="text-primary-foreground/80 font-body text-sm sm:text-base mb-6 max-w-sm mx-auto">
          Browse the feed for instant wisdom, or share your own lesson in under a minute.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading font-bold shadow-md w-full sm:w-auto"
            >
              🏠 Browse the Feed
            </Button>
          </Link>
          <Link to="/share">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-heading font-bold w-full sm:w-auto"
            >
              ✍️ Share Your Lesson
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
