import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type ContentType = 'blog' | 'examples' | 'packages';

const contentDirectory = path.join(process.cwd(), 'src/content');

export function getPostSlugs(type: ContentType) {
  const dir = path.join(contentDirectory, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir);
}

export function getPostBySlug(slug: string, type: ContentType) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, type, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { slug: realSlug, meta: data, content };
}

export function getAllPosts(type: ContentType) {
  const slugs = getPostSlugs(type);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, type))
    .filter(Boolean)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1!.meta.date > post2!.meta.date ? -1 : 1));
  return posts;
}
