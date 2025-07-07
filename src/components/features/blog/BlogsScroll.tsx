"use client";

import type { CollectionEntry } from "astro:content";
import BlogCard from "./BlogCard";

interface blogType {
  blogs: CollectionEntry<"blogs">[];
}

export default function BlogsScroll({ blogs }: { blogs: blogType["blogs"] }) {
  return (
    <div className="max-h-[50vh] xl:max-h-[40vh] h-fit overflow-y-auto overflow-x-hidden ">
      {blogs.map((blog) => {
        const { title, author, description, readtime, tags } = blog["data"];
        return (
          <div className="py-3 flex justify-center">
            <BlogCard
              title={title}
              authorName={author?.name || "Desconocido"}
              description={description}
              readtime={readtime}
              tags={tags}
            />
          </div>
        );
      })}
    </div>
  );
}
