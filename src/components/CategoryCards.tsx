import Link from "next/link";
import Image from "next/image";
import { mockCategories, type Category } from "@/lib/mockCategories";

export default function CategoryCards() {
  return (
    <section className="category-section">
      <h2 className="section-title">Explore Categories</h2>
      <div className="card-grid">
        {mockCategories.map((cat: Category) => (
          <Link
            key={cat.id}
            href={`/quizzes?category=${cat.id}`}
            className="glass quiz-list-item"
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
        ))}
      </div>
    </section>
  );
}
