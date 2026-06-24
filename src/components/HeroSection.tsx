import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <motion.section
      className="hero glass hero-bg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="hero-grid" variants={itemVariants}>
        <motion.div className="hero-card" variants={itemVariants}>
          <h1 className="section-title">Mock Test Platform</h1>
          <p className="section-subtitle">
            Create, share, and take quizzes with a sleek, fast UI.
          </p>
          <div className="button-row" style={{ marginTop: "1rem" }}>
            <Link
              href="/quizzes/new"
              className="link-button link-button-primary ripple"
            >
              Create Quiz
            </Link>
            <Link
              href="/quizzes"
              className="link-button link-button-secondary ripple"
            >
              Browse Quizzes
            </Link>
          </div>
        </motion.div>
        <aside className="panel" variants={itemVariants}>
          <h2 className="section-title">Quick actions</h2>
          <nav className="meta-grid">
            <Link href="/quizzes" className="quiz-list-item glass">
              <h3>Take a quiz</h3>
              <p className="muted">Launch a quiz and submit your score.</p>
            </Link>
            <Link href="/attempts" className="quiz-list-item glass">
              <h3>Review attempts</h3>
              <p className="muted">See completed results in a table.</p>
            </Link>
            <Link href="/quizzes/new" className="quiz-list-item glass">
              <h3>Create content</h3>
              <p className="muted">Add a new quiz with questions and options.</p>
            </Link>
          </nav>
        </aside>
      </motion.div>
    </motion.section>
  );
}
