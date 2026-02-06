import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-secondary">The page you are looking for doesn’t exist.</p>
      <Link href="/" aria-label="Go home">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
