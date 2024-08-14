import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <section className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-20 md:mb-28">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <div className="md:w-1/2">
        <h3 className="mb-4 text-4xl lg:text-5xl leading-tight">
          <Link href={`/posts/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        <div className="mb-4 text-lg">
          <DateFormatter dateString={date} />
        </div>
        <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
        <Avatar name={author.name} picture={author.picture} />
      </div>
    </section>
  );
}
