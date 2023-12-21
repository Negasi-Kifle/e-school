import slugify from "slugify";

export default function slugifer(title: string): string{
    return slugify(title, '_');
}