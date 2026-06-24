import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { mockCategories, type Category } from "@/lib/mockCategories";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CategoryCards() {
  return (
    <section className="category-section" aria-labelledby="category-heading">
      <h2 id="category-heading" className="section-title">Explore Categories</h2>
      <motion.div
        className="card-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {mockCategories.map((cat: Category) => (
          <motion.div key={cat.id} variants={itemVariants}>
            <Link
              href={`/quizzes?category=${cat.id}`}
              className="glass quiz-list-item ripple"
              aria-label={`Category ${cat.name}`}
            >
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={64}
                  height={64}
                  className="category-icon"
                />
              )}
              <h3>{cat.name}</h3>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
