"use client";

import type { CollectionEntry } from "astro:content";
import BlogCard from "./BlogCard";

import type { Blogs } from "@/types";

export default function BlogsScroll({ blogs }: { blogs: Blogs[] }) {
  return (
    <div className="max-h-[50vh] xl:max-h-[40vh] h-fit overflow-y-auto overflow-x-hidden ">
      {blogs.map((blog) => (
        <div className="py-3 flex justify-center" key={blog.id}>
          <BlogCard
            title={blog.title}
            authorName={blog.user_name || "Desconocido"}
            type="blogs"
            organizationName={blog.organization_name}
            description={blog.tags}
            readtime={blog.readtime}
            tags={blog.tags ? blog.tags.split(",").map((t) => t.trim()) : []}
            period_time={blog.period_time}
            user_role={blog.user_role}
            created_at={blog.created_at}
            updated_at={blog.updated_at}
          />
        </div>
      ))}
    </div>
  );
}
